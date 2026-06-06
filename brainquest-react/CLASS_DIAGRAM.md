# BrainQuest Class Diagram

## 📋 Diagram Overview

The class diagram depicts the **object-oriented structure** of the BrainQuest system. Key classes include:

- **User** (with Child and Parent subclasses)
- **GameModule** (with Math, Puzzle, Drawing, and Science subclasses)
- **Badge**
- **Mission**
- **Progress**
- **Session**

Each class shows its **attributes** and **methods**, along with the relationships (**associations**, **inheritance**, and **aggregations**) between them.

---

## 🎯 Class Structure

```mermaid
classDiagram
    %% Main User Hierarchy
    class User {
        <<abstract>>
        -userId: string
        -name: string
        -avatar: string
        -email: string
        -createdDate: Date
        +getProfile()
        +updateProfile(name, avatar)
        +login()
        +logout()
    }

    class Child {
        -age: number
        -grade: number
        -learningLevel: string
        -parentId: string
        +playGame(gameType)
        +completeLevel(levelId, stars)
        +earnBadge(badgeId)
    }

    class Parent {
        -childrenIds: string[]
        -subscriptionLevel: string
        +setScreenTimeLimit(minutes)
        +monitorProgress(childId)
        +resetChildProgress(childId)
        +viewAnalytics(childId)
    }

    %% Game Module Hierarchy
    class GameModule {
        <<abstract>>
        -moduleId: string
        -name: string
        -totalLevels: number
        -difficulty: string
        +startGame(level)
        +endGame()
        +calculateScore()
        +getReward()
    }

    class MathGame {
        -questionBank: Question[]
        -operations: string[]
        +generateQuestion()
        +validateAnswer(answer)
        +calculateXP()
    }

    class PuzzleGame {
        -puzzleSet: Puzzle[]
        -complexity: number
        +solvePuzzle(solution)
        +checkSolution()
        +giveHint()
    }

    class DrawingGame {
        -imageTemplates: Image[]
        -colorPalette: Color[]
        +startDrawing()
        +submitDrawing()
        +getColorTools()
    }

    class ScienceGame {
        -factDatabase: Fact[]
        -experimentBank: Experiment[]
        +presentConcept()
        +answerQuestion()
        +completeExperiment()
    }

    %% Badge System
    class Badge {
        -badgeId: string
        -name: string
        -icon: string
        -description: string
        -criteria: string
        -xpReward: number
        +checkEarned(progress)
        +displayBadge()
    }

    %% Mission/Quest System
    class Mission {
        -missionId: string
        -title: string
        -description: string
        -gameType: string
        -targetLevel: number
        -reward: number
        -status: string
        +startMission()
        +completeMission()
        +calculateReward()
    }

    %% Progress Tracking
    class Progress {
        -progressId: string
        -childId: string
        -xp: number
        -totalLevels: number
        -completedLevels: number
        -badges: Badge[]
        -streak: number
        -lastPlayDate: Date
        +addXP(amount)
        +updateLevel(gameType, level)
        +calculateStreak()
        +getProgressPercentage()
    }

    %% Game Session
    class Session {
        -sessionId: string
        -userId: string
        -gameModule: GameModule
        -startTime: Date
        -endTime: Date
        -duration: number
        -levelPlayed: number
        -starsEarned: number
        -xpGained: number
        +recordSessionData()
        +calculateSessionStats()
        +saveSessionHistory()
    }

    %% Relationships
    User <|-- Child : inherits
    User <|-- Parent : inherits
    
    GameModule <|-- MathGame : inherits
    GameModule <|-- PuzzleGame : inherits
    GameModule <|-- DrawingGame : inherits
    GameModule <|-- ScienceGame : inherits
    
    Parent "1" --> "many" Child : monitors
    Child "1" --> "many" Session : plays
    Child "1" --> "1" Progress : tracks
    
    Session "1" --> "1" GameModule : uses
    Progress "1" --> "many" Badge : earns
    Progress "1" --> "many" Mission : completes
    
    Mission "1" --> "1" GameModule : requires
    Badge "1" --> "1" Progress : awards
    
    Child "many" --> "many" Mission : undertakes
```

---

## 📊 Relationship Types

### **Inheritance (--|>)**
- `Child` and `Parent` inherit from `User`
- `MathGame`, `PuzzleGame`, `DrawingGame`, and `ScienceGame` inherit from `GameModule`

### **Associations (-->)**
- `Parent` monitors multiple `Child` users
- `Child` plays multiple `Session` instances
- `Child` has one `Progress` tracker
- `Session` uses one `GameModule`
- `Progress` tracks multiple `Badge`s and `Mission`s
- `Mission` requires one `GameModule`

### **Aggregations**
- Progress aggregates Badges (child can exist without badges)
- Child aggregates Sessions (sessions depend on child)

---

## 🎮 Key Attributes & Methods

### **User Classes**
| Class | Key Attributes | Key Methods |
|-------|---|---|
| **User** | userId, name, avatar, email | getProfile(), updateProfile() |
| **Child** | age, grade, learningLevel | playGame(), completeLevel(), earnBadge() |
| **Parent** | childrenIds, subscriptionLevel | setScreenTimeLimit(), monitorProgress() |

### **Game Modules**
| Class | Key Attributes | Key Methods |
|-------|---|---|
| **MathGame** | questionBank, operations | generateQuestion(), validateAnswer() |
| **PuzzleGame** | puzzleSet, complexity | solvePuzzle(), checkSolution() |
| **DrawingGame** | imageTemplates, colorPalette | startDrawing(), submitDrawing() |
| **ScienceGame** | factDatabase, experimentBank | presentConcept(), answerQuestion() |

### **System Classes**
| Class | Key Attributes | Key Methods |
|-------|---|---|
| **Progress** | xp, completedLevels, streak, badges | addXP(), updateLevel(), calculateStreak() |
| **Session** | sessionId, duration, starsEarned | recordSessionData(), calculateSessionStats() |
| **Mission** | missionId, targetLevel, reward, status | startMission(), completeMission() |
| **Badge** | badgeId, name, criteria, xpReward | checkEarned(), displayBadge() |

---

## ✨ Design Patterns

1. **Template Method Pattern** - GameModule defines the game flow
2. **Observer Pattern** - Parent observes Child progress
3. **Strategy Pattern** - Different GameModule strategies (Math, Puzzle, etc.)
4. **Data Transfer Object** - Session encapsulates game session data
5. **Decorator Pattern** - Badge adds rewards to Progress

### 💾 **Data Models**
- Level, World, Badge, Puzzle, Question, Fact, Image

Both diagrams are saved in your project! 📁
