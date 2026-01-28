LiveKit (Web mic) + Amazon Bedrock Nova 2 Sonic “Receptionist” (Blanc Restoration)

This doc shows an end-to-end setup where a user opens a web page, clicks mic, and talks to an AI receptionist that can triage fire / water / mold damage, collect details, and create a lead.

0. What you’re building

Flow

User opens your web app and connects via WebRTC (mic).

LiveKit routes audio in real time.

Your LiveKit Agent Server joins the room and runs a speech-to-speech model: Amazon Nova 2 Sonic via Bedrock.

The agent uses tools (functions) to create a lead + optionally notify on-call.

LiveKit + Nova Sonic integration is designed for realtime voice apps (full-duplex audio, VAD/noise suppression, etc.).

1. Prereqs

LiveKit Cloud project (or self-host LiveKit).

AWS account with Bedrock access to Nova Sonic.

Python 3.12+ recommended.

Node/React for the frontend.

2. Backend — LiveKit Agent Server (Python)
   2.1 Install dependencies

From a new folder:

brew install livekit livekit-cli
curl -LsSf https://astral.sh/uv/install.sh | sh

uv init blanc_voice_agent
cd blanc_voice_agent
uv venv --python 3.12

# Core agent + env loader + AWS realtime plugin

uv add livekit-agents python-dotenv 'livekit-plugins-aws[realtime]'

This matches the AWS + LiveKit Nova Sonic setup pattern.

Optional (recommended): noise cancellation plugin (helps on bad mics / phone audio). LiveKit quickstart uses it.

uv add "livekit-plugins-noise-cancellation~=0.2"

2.2 Environment variables

Create .env.local:

# LiveKit (Cloud)

LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
LIVEKIT_URL=wss://<your-project>.livekit.cloud

# AWS (Bedrock)

AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

LiveKit’s quickstart expects LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL in .env.local.
AWS credentials are required for the Nova Sonic Bedrock calls.

2.3 Agent code (agent.py)

This uses the Agent Server pattern (each inbound session/job runs your entrypoint).

import os
from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import AgentServer, AgentSession, Agent, RunContext, function_tool, room_io
from livekit.plugins.aws.experimental.realtime import RealtimeModel

try:
from livekit.plugins import noise_cancellation
HAS_BVC = True
except Exception:
HAS_BVC = False

load_dotenv(".env.local")

# ---- Blanc-specific grounding (keep it short; add RAG later) ----

BLANC_CONTEXT = """
Company: Blanc Restoration
Service area: New York, New Jersey, and Upstate New York.
Services: Fire Damage Restoration, Water Damage Restoration, Mold Remediation.
Positioning: fast response, restoration begins quickly; team helps with insurance paperwork.
Safety: If there's an active fire, gas smell, or immediate danger, instruct the caller to call emergency services first.
""".strip()

RECEPTIONIST_INSTRUCTIONS = f"""
You are Blanc Restoration’s voice receptionist.
You must:

- Triage: Fire / Water / Mold (or “not sure”).
- Collect: name, phone, address/zip, damage type, when it happened, whether it's ongoing, and any safety hazards.
- If urgent (active leak, sewage backup, large flooding, smoke smell, structural risk): mark urgency=urgent and offer immediate dispatch.
- If the caller is in danger (active fire, medical emergency, gas smell): tell them to call emergency services first.
- If insurance-related: reassure we can help with claim paperwork; do not promise coverage.
- Keep responses concise and spoken (no emojis, no bullet formatting).
  Grounding:
  {BLANC_CONTEXT}
  """

class BlancReceptionist(Agent):
def **init**(self):
super().**init**(instructions=RECEPTIONIST_INSTRUCTIONS)

    @function_tool()
    async def create_lead(
        self,
        context: RunContext,
        name: str,
        phone: str,
        address: str,
        damage_type: str,   # "fire" | "water" | "mold" | "unknown"
        urgency: str,       # "urgent" | "standard"
        notes: str = "",
    ) -> dict:
        """
        Create a lead for Blanc Restoration. Use when you have enough details to follow up.
        Return a JSON object with lead_id and next_steps.
        """
        # TODO: Replace with your CRM call / DB insert
        lead_id = f"lead_{abs(hash((name, phone))) % 10_000_000}"
        return {
            "ok": True,
            "lead_id": lead_id,
            "next_steps": "A project manager will call you shortly to schedule a site survey.",
        }

    @function_tool()
    async def notify_oncall(
        self,
        context: RunContext,
        message: str,
    ) -> dict:
        """
        Notify the on-call team for urgent cases (SMS/Slack/etc).
        Only use for urgency=urgent or safety-sensitive situations.
        """
        # TODO: Hook up Twilio/Slack webhook
        return {"ok": True}

server = AgentServer()

# Optional: name your agent if you plan to dispatch by name from the frontend token/session flow.

@server.rtc_session(agent_name="blanc-receptionist")
async def blanc_agent(ctx: agents.JobContext): # Nova Sonic 2.0 supports "mixed" modalities (audio + text input) and voice selection. :contentReference[oaicite:8]{index=8}
model = RealtimeModel.with_nova_sonic_2(
voice="tiffany",
region=os.getenv("AWS_REGION", "us-east-1"),
max_tokens=4000,
)

    session = AgentSession(
        llm=model,
    )

    room_opts = None
    if HAS_BVC:
        # Noise cancellation is commonly used in LiveKit voice agents. :contentReference[oaicite:9]{index=9}
        room_opts = room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: noise_cancellation.BVC()
                if params.participant.kind != rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                else noise_cancellation.BVCTelephony(),
            ),
        )

    await session.start(
        room=ctx.room,
        agent=BlancReceptionist(),
        room_options=room_opts,
    )

    # First turn
    await session.generate_reply(
        instructions="Greet the caller as Blanc Restoration. Ask what happened (fire, water, or mold) and whether anyone is currently unsafe."
    )

if **name** == "**main**":
agents.cli.run_app(server)

Notes

RealtimeModel.with_nova_sonic_2(...) is the LiveKit AWS plugin helper for Nova Sonic 2.0, including voice/region/max tokens.

Tools are defined with @function_tool() inside your Agent class.

In LiveKit Cloud, each job runs isolated in its own process, so one crash doesn’t take down other sessions.

2.4 Run the agent (dev)
uv run agent.py dev

LiveKit’s quickstart uses dev mode to connect your agent to LiveKit Cloud for testing.

3. Frontend — Web mic (React)

You have two easy paths:

Path A (fastest demo): LiveKit Sandbox Token Server + useSession

LiveKit’s React quickstart provides a ready pattern that gives you mic controls and connects to your agent by name.

Create a React app and install packages:

npm create vite@latest blanc-voice-web -- --template react-ts
cd blanc-voice-web
npm install @livekit/components-react @livekit/components-styles livekit-client

Replace src/App.tsx with the quickstart pattern (edit sandboxId + agentName):

'use client';

import { useEffect, useRef } from 'react';
import {
ControlBar,
RoomAudioRenderer,
useSession,
SessionProvider,
useAgent,
BarVisualizer,
} from '@livekit/components-react';
import { TokenSource, TokenSourceConfigurable, TokenSourceFetchOptions } from 'livekit-client';
import '@livekit/components-styles';

export default function App() {
const tokenSource: TokenSourceConfigurable = useRef(
TokenSource.sandboxTokenServer('YOUR_SANDBOX_ID'),
).current;

const tokenOptions: TokenSourceFetchOptions = { agentName: 'blanc-receptionist' };

const session = useSession(tokenSource, tokenOptions);

useEffect(() => {
session.start();
return () => session.end();
}, []);

return (
<SessionProvider session={session}>
<div data-lk-theme="default" style={{ height: '100vh' }}>
<MyAgentView />
<ControlBar controls={{ microphone: true, camera: false, screenShare: false }} />
<RoomAudioRenderer />
</div>
</SessionProvider>
);
}

function MyAgentView() {
const agent = useAgent();
return (
<div style={{ height: '350px' }}>
<p>Agent state: {agent.state}</p>
{agent.canListen && (
<BarVisualizer track={agent.microphoneTrack} state={agent.state} barCount={5} />
)}
</div>
);
}

This is directly from LiveKit’s React quickstart (same hooks/components).

Run:

npm run dev

Open the local URL, enable the mic, talk.

Path B (production): Your own token endpoint (don’t ship secrets to browser)

For real deployments, you typically run a small backend that generates LiveKit access tokens (so LIVEKIT_API_SECRET never reaches the browser). LiveKit’s docs point to a “Generating tokens” guide from the React quickstart.

Implementation options:

Next.js /api/token route using LiveKit server SDK

Fastify/Express token service

Cloudflare Worker

(If you want, I’ll paste a copy-paste Next.js token route + client connection flow; I didn’t include it here because Path A is the quickest demo and matches what you asked: web mic + end-to-end.)

4. “Training” the receptionist for fire/water/mold (what to do in practice)

Nova Sonic doesn’t need fine-tuning for this. Do this instead:

System instructions (done above): tight receptionist script + safety rules + what info to collect.

Grounding text: keep a short BLANC_CONTEXT describing services + service area + insurance help (from their site).

Tools:

create_lead(...)

notify_oncall(...)

Optional RAG (later): scrape your own FAQ/service pages into a small knowledge base and add a lookup_kb(query) tool. LiveKit explicitly supports tools calling external APIs / RAG.

5. Deploy (when you’re ready)

LiveKit’s CLI can scaffold and deploy your agent to LiveKit Cloud (lk agent create).
And LiveKit Cloud will start jobs as needed; each job runs in its own process.

6. Common gotchas

No Bedrock access → ensure Nova Sonic is enabled in your AWS region/account.

Agent name mismatch → if your frontend requests agentName: 'blanc-receptionist', your backend should register with the same agent_name.

No audio → ensure RoomAudioRenderer is mounted and mic permission is granted.
