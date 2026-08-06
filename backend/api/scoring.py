from typing import Optional 

CORRECT_FULL = (100, 100)
CORRECT_INCOMPLETE = (60, 40)
INCORRECT_FULL = (20, 20)
INCORRECT_INCOMPLETE = (0, 0)

CONFIDENCE_MODIFIERS = {
    1: (1.00, 0.00),
    2: (1.05, 0.00),
    3: (1.10, 0.05),
    4: (1.20, 0.15),
    5: (1.35, 0.30)
}

def compute_scoring(
    verdict_chosen: str, 
    correct_verdict: str, 
    tools_used: list,
    checklist: dict, 
    confidence: int,
    followed_recommendation: Optional[bool] = None,
    recommended_verdict: Optional[str] = None,
) -> dict:

    is_correct = verdict_chosen == correct_verdict
    full_process = len(tools_used) >= 2 and all(checklist.values())
    unsupported = len(tools_used) < 2 

    #Base score:
    if is_correct:
        score_s, score_v = CORRECT_FULL if full_process else CORRECT_INCOMPLETE
    else:
        score_s, score_v = INCORRECT_FULL if full_process else INCORRECT_INCOMPLETE

    #Unsupported verdict
    if unsupported:
        score_s = round(score_s * 0.75)
        score_v = round(score_v * 0.75)

    #Follow / override matrix (skipped in Round 3 solo: value is None)

    if followed_recommendation is not None:
        
        if followed_recommendation and not is_correct:
            score_s = round(score_s * 0.5)
            score_v = round(score_v * 0.5)

        elif not followed_recommendation:
            if is_correct:
                score_v = score_v if recommended_verdict == correct_verdict else 0
            else:
                score_s = 0
                score_v = 0

    bonus, penalty = CONFIDENCE_MODIFIERS.get(confidence, CONFIDENCE_MODIFIERS[1]) 
    modifier = bonus if is_correct else (1 - penalty)
    score_s = round(score_s * modifier)
    score_v = round(score_v * modifier)    
    
    return {
        "is_correct": is_correct,
        "full_process": full_process,
        "unsupported": unsupported,
        "score_scroller": score_s,
        "score_verifier": score_v,
    }