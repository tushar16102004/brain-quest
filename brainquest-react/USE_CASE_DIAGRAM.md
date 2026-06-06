# BrainQuest Use Case Diagram

```mermaid
graph TB
    subgraph Actors
        Child["👶 Child/Player"]
        Parent["👨‍👩‍👧 Parent/Guardian"]
    end

    subgraph GameSystem["BrainQuest System"]
        direction TB
        
        subgraph ProfileMgmt["Profile Management"]
            Splash["Splash Screen"]
            CreateProfile["Create Profile<br/>Select Avatar & Name"]
            ViewHome["View Home Screen"]
        end

        subgraph GamePlay["Gameplay"]
            PlayPuzzle["Play Puzzle Game<br/>🧩"]
            PlayMath["Play Math Game<br/>🔢"]
            PlayColoring["Play Coloring Game<br/>🎨"]
            PlayScience["Play Science Game<br/>🔬"]
            SelectLevel["Select Level"]
            EarnXP["Earn XP/Rewards"]
            CompleteLevel["Complete Level"]
        end

        subgraph Progression["Progression & Rewards"]
            ViewRewards["View Badges & Rewards"]
            UnlockNewWorlds["Unlock New Worlds"]
            TrackStreak["Track Daily Streak"]
            ViewProgress["View Progress"]
        end

        subgraph Settings["Settings & Parental Controls"]
            OpenSettings["Open Settings Panel"]
            ToggleSound["Toggle Sound On/Off"]
            TogglePerformanceMode["Toggle Performance Mode"]
            ChangeLanguage["Change Language"]
            SetScreenTimeLimit["Set Screen Time Limit"]
            ViewParentsPanel["View Parents Panel"]
            ResetProgress["Reset Progress<br/>Parent Control"]
        end

        subgraph Feedback["User Feedback"]
            PlaySoundFX["Play Sound Effects"]
            ShowConfetti["Show Confetti Animation"]
            DisplayWinOverlay["Display Win Message"]
        end
    end

    Child --> Splash
    Splash --> CreateProfile
    CreateProfile --> ViewHome
    
    ViewHome --> SelectLevel
    SelectLevel --> PlayPuzzle
    SelectLevel --> PlayMath
    SelectLevel --> PlayColoring
    SelectLevel --> PlayScience
    
    PlayPuzzle --> CompleteLevel
    PlayMath --> CompleteLevel
    PlayColoring --> CompleteLevel
    PlayScience --> CompleteLevel
    
    CompleteLevel --> EarnXP
    EarnXP --> ViewRewards
    ViewRewards --> UnlockNewWorlds
    UnlockNewWorlds --> ViewProgress
    
    ViewHome --> TrackStreak
    ViewHome --> OpenSettings
    
    OpenSettings --> ToggleSound
    OpenSettings --> TogglePerformanceMode
    OpenSettings --> ChangeLanguage
    OpenSettings --> SetScreenTimeLimit
    
    Parent --> ViewParentsPanel
    Parent --> SetScreenTimeLimit
    Parent --> ResetProgress
    
    CompleteLevel --> PlaySoundFX
    CompleteLevel --> ShowConfetti
    CompleteLevel --> DisplayWinOverlay
    
    EarnXP -.-> PlaySoundFX
    
    style Child fill:#FFA500
    style Parent fill:#FF6B6B
    style ProfileMgmt fill:#E3F2FD
    style GamePlay fill:#F3E5F5
    style Progression fill:#E8F5E9
    style Settings fill:#FCE4EC
    style Feedback fill:#FFF3E0
```

## Summary

- **Actors:** Child/Player and Parent/Guardian
- **5 Main Modules:** Profile Management, Gameplay, Progression & Rewards, Settings & Parental Controls, User Feedback
- **4 Games:** Puzzle, Math, Coloring, Science
- **Features:** XP system, badges, streak tracking, screen time limits, sound/performance toggles
