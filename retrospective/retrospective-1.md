TEMPLATE FOR RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed (4) vs. done (3) 
- Total points committed (9) vs. done (4)
- Nr of hours planned (103h) vs. spent (as a team) (109h 05m)

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed 0

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    9    |        |     38h    |      36h     |
| _#1_   |    8    |    2   |      13h 30m    |      18h 40m   |
| _#2_   |    7    |    1   |      15h 30m    |      14h       |
| _#3_   |    6    |    1   |      15h        |      16h 50m   |
| _#4_   |    7    |    5   |      11h        |      9h        |
   

> story `#0` is for technical tasks, leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
- Total estimation error ratio: sum of total hours spent / sum of total hours effort - 1

    $$\frac{\sum_i spent_{task_i}}{\sum_i estimation_{task_i}} - 1$$ 

    Total estimation error ratio: `0.016123`
 
    
- Absolute relative task estimation error: sum( abs( spent-task-i / estimation-task-i - 1))/n

    $$\frac{1}{n}\sum_i^n \left| \frac{spent_{task_i}}{estimation_task_i}-1 \right| $$

    Absolute relative task estimation error: `0.0226`
  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 3 + 3 + 3 = `9h`
  - Total hours spent: 2 + 5 + 2 = `9h`
  - Nr of automated unit test cases: 23
  - Coverage (if available): 
- E2E testing:
  - Total hours estimated: 3 + 3 + 2 + 2 = `10h`
  - Total hours spent: 4 + 2 + 2 + 1.5 = `12h 30m`
- Code review 
  - Total hours estimated: 2 + 6 + 3 = `11h` 
  - Total hours spent: 1.5 + 5.5 + 3.5 = `10h 30m`

## ASSESSMENT

- What caused your errors in estimation (if any)?
  - Wasted time: 
    - Polito Wifi blocking db access
    - Fixing commits breaking compilation and API standards
    - Solving merge conficts

- What lessons did you learn (both positive and negative) in this sprint?
  - No commit is better than a slapdash commit.
  - Better to divide the group into sub-teams and keep the same people in the same team until the end, to the detriment of learning.
- Which improvement goals set in the previous retrospective were you able to achieve? 
  - Not applicable
- Which ones you were not able to achieve? Why?
  - Not applicable
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Introduce a commit or PR good practices checklist
  - Add less dependencies
  - Less learning tasks
  - Choose tecnologies that we are comfortable with
  - Starting from API draft
- One thing you are proud of as a Team!!
  - We manage to learn new tecnologies (Postegres, Typescript and WebSocket)
  - Good experience to know new people