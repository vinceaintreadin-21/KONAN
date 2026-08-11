import type { Verdict } from '../types';
import { endpoint } from '../utils/endpoint';

export interface RoomResponse {
    id: number;
    room_code: string;
    phase: string;
    current_scenario: number | null;
    round_number: number;
}

export interface PlayerResponse {
    id: number;
    room: number;
    name: string;
    device_type: string;
    score: number;
}

export interface ScenarioScrollerResponse {
    id: number;
    account_name: string;
    handle: string;
    follower_count: number;
    following_count: number;
    verified: boolean;
    avatar_color: string;
    time_posted: string;
    caption: string;
    image_url: string;
    image_alt: string;
    likes: number;
    retweets: number;
    replies: number;
    views: number;
}

export interface ScenarioVerifierResponse {
    id: number;
    tool_account_history: Record<string, unknown>
    tool_domain_authority: Record<string, unknown>
    tool_image_metadata: Record<string, unknown>
    tool_whois: Record<string, unknown>
    tool_cross_source: Record<string, unknown>
    tool_keyword_analysis: Record<string, unknown>

    // ground truth fields only appear when room.phase === 'reveal'
    correct_verdict?: string;
    ground_truth_explanation?: string;
    primary_verification_signal?: string;
}

export interface AttemptResponse {
    id: number;
    is_correct: boolean;
    score_scroller: number;
    score_verifier: number;
    verdict_chosen: string | any;
    confidence: number;
}

//-- Room --

// Scroller creates a room then it returns a room code

export async function createRoom(playerName = 'Player A'): Promise<RoomResponse> {
    const res = await endpoint.post<RoomResponse>('/rooms/', {
        name: playerName
    })
    return res.data;
}

export async function joinRoom(roomCode: string, playerName = 'Player B'): Promise<PlayerResponse> {
    const res = await endpoint.post<PlayerResponse>('/rooms/join/', {
        room_code: roomCode,
        name: playerName,
    })
    return res.data
}

// Poll to check room phase

export async function getRoom(roomId: number): Promise<RoomResponse> {
    const res = await endpoint.get<RoomResponse>(`/rooms/${roomId}`)
    return res.data
}

// Scroller view -- returns post data

export async function getScenarioScroller(
    scenarioId: number,
): Promise<ScenarioScrollerResponse> {
    const res = await endpoint.get<ScenarioScrollerResponse>(
        `/scenarios/${scenarioId}/?role=scroller`,
    )
    return res.data
} 

// Verifier view -- returns tool payloads

export async function getScenarioVerifier(
    scenarioId: number,
    roomId: number
): Promise<ScenarioVerifierResponse> {
    const res = await endpoint.get<ScenarioVerifierResponse>(
        `scenarios/${scenarioId}/?role=verifier&room=${roomId}`
    )
    return res.data
}

// Attempt (Scoring)

export interface SubmitAttemptPayload {
    room: number;
    round: number | null;
    scenario: number;
    verdict_chosen: Verdict;
    confidence: number;
    checklist_account_name: boolean;
    checklist_account_age: boolean;
    checklist_post_type: boolean;
    checklist_claim: boolean;
    checklist_anomalies: boolean;
    tools_used: string[];
    followed_recommendation: boolean | null;
    description_neutrality: number;
    description_anomaly_awareness: number;
    description_completeness: number;
    description_precision: number;
}

// Submit attempt and get scores from backend

export async function submitAttempt(
    payload: SubmitAttemptPayload
): Promise<AttemptResponse> {
    const res = await endpoint.post<AttemptResponse>('/attempts/', payload)
    return res.data
}

//fetch all attemps

export async function getAttempts():Promise<AttemptResponse[]> {
    const res = await endpoint.get<AttemptResponse[]>('/attempts/')
    return res.data
}

// update existing attempt with verdict and tools_used

export async function updateAttempt(
    attemptId: number,
    payload: Partial<SubmitAttemptPayload>
): Promise<AttemptResponse> {
    const res = await endpoint.patch<AttemptResponse>(`/attempts/${attemptId}/`, payload)
    return res.data
}

//advance the room to the next round
export async function nextRound(roomId: number): Promise<RoomResponse> {
    const res = await endpoint.post<RoomResponse>(`/rooms/${roomId}/next_round/`)
    return res.data
}