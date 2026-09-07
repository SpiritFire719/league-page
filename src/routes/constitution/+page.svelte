<script>
    import { dues } from '$lib/utils/helper';
    let one, oneOne, oneTwo, oneTwoOne, oneTwoTwo, oneTwoThree, oneTwoFour, oneTwoFive, oneThree;
    let two, twoOne, twoTwo;
    let three, threeOne;
    let four, fourOne, fourTwo;
    let five, fiveOne;
    let six, sixOne, sixTwo;
    let seven, sevenOne, sevenTwo, sevenThree;
    let eight, eightOne, eightTwo, eightThree;

    const goToSection = (section) => {
        const top = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({left: 0, top, behavior: 'smooth'});
    }
</script>

<style>
    .constitution {
        position: relative;
        z-index: 1;
        width: 92%;
        max-width: 800px;
        margin: 8em auto 10em;
    }

    h1 {
        font-size: 2em;
        line-height: 1.2em;
        text-align: center;
        margin: 2em 0 1.5em;
    }

    h2 {
        font-size: 1.5em;
        line-height: 1.2em;
    }

    h3 {
        text-decoration: underline;
        font-size: 1.3em;
        line-height: 1.2em;
    }

    h4 {
        text-decoration: underline;
        margin-left: 2em;
        font-size: 1.2em;
        line-height: 1.2em;
    }

    h5 {
        margin-left: 6em;
        font-size: 0.8em;
        line-height: 1.1em;
    }

    .subBlock {
        margin-left: 2.4em;
    }

    .sectionHeading {
        margin: 4em 0 1.5em;
    }

    .subSectionHeading {
        margin: 1.5em 0 1.5em;
    }

    .underscore {
        text-decoration: underline;
    }

    .right {
        text-align: right;
    }

    .noUnderscore {
        text-decoration: none;
    }

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        color: #00316b;
    }

    p {
        color: #777;
    }
</style>

<div class="constitution">
    <h1 class="noUnderscore">LEGENDS LEAGUE CONSTITUTION</h1>
    
    <h2 class="noUnderscore">TABLE OF CONTENTS</h2>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(one)}>Section 1: Roster</h3>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(oneOne)}>1.1 Positional Breakdown</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(oneTwo)}>1.2 Trading</h4>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoOne)}>1.2.1 Trade Collusion</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoTwo)}>1.2.2 Lending Players Prohibition</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoThree)}>1.2.3 Trade Deadline</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoFour)}>1.2.4 Trade Restrictions</h5>
            <h5 class="noUnderscore clickable" onclick={() => goToSection(oneTwoFive)}>1.2.5 Veto/Trade Process</h5>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(oneThree)}>1.3 Waiver Wire</h4>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(two)}>Section 2: Drafting</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(twoOne)}>2.1 Draft Order</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(twoTwo)}>2.2 Draft Day Trades</h4>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(three)}>Section 3: Scoring System</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(threeOne)}>3.1 Voting on Scoring System</h4>
    
    <h3 class="noUnderscore clickable" onclick={() => goToSection(four)}>Section 4: Postseason</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(fourOne)}>4.1 Playoffs</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(fourTwo)}>4.2 Playoff Tiebreakers</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(five)}>Section 5: Tanking Policy</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(fiveOne)}>5.1 League Tanking Policy</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(six)}>Section 6: Replacing Managers</h3>
    
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sixOne)}>6.1 Removing Managers</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sixTwo)}>6.2 Replacing Managers</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(seven)}>Section 7: League Finances</h3>

        <h4 class="noUnderscore clickable" onclick={() => goToSection(sevenOne)}>7.1 League Dues</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sevenTwo)}>7.2 Payout</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(sevenThree)}>7.3 Raising Dues</h4>

    <h3 class="noUnderscore clickable" onclick={() => goToSection(eight)}>Section 8: League Punishment</h3>

        <h4 class="noUnderscore clickable" onclick={() => goToSection(eightOne)}>8.1 League Punishment</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(eightTwo)}>8.2 Punishment Fulfilment</h4>
        <h4 class="noUnderscore clickable" onclick={() => goToSection(eightThree)}>8.3 Punishments</h4>


    <hr />
    
    <h2 class="sectionHeading" bind:this={one}>Section 1 Roster Breakdown</h2>
    
    <h3 class="subSectionHeading" bind:this={oneOne}>1.1 Positional Breakdown</h3>

    <p>13 Total Roster Spots</p>

    <p class="underscore">Starters</p>
    <ul>
        <li>QB</li>
        <li>RB</li>
        <li>RB</li>
        <li>WR</li>
        <li>WR</li>
        <li>TE</li>
        <li>FLEX (RB/WR/TE)</li>
        <li>DEF</li>
    </ul>

    <p>5 Bench</p>

    <p>1 IR Spot (Player must be labeled as IR, Out, or Covid in the Sleeper App)</p>

    <p>No positional maximums.</p>


    <h3 class="subSectionHeading" bind:this={oneTwo}>1.2 Trading</h3>

    <p>Players and FAAB $ are tradeable assets. No draft pick trades are allowed, as this is a pure redraft league. The only draft-related trade permitted is a single draft position swap between managers prior to the draft.</p>

    <h4 bind:this={oneTwoOne}>1.2.1 Trade Collusion</h4>
    <div class="subBlock">
        <p>An accusation of collusion is a serious matter, and if any two (or more) managers are suspected of collusion, some form of evidence must be presented to the commissioner(s). Upon review of the evidence and circumstance by the commissioner(s), if the involved parties are determined in fact to have colluded via trade, the managers will be removed immediately from the league, their roster will be locked for the remainder of the season, and the league year will be played out with the remaining managers and rostered players. Managers who have been removed will not receive their league dues back, and will be banned from participating in the league for any future seasons.</p>
    </div>

    <h4 bind:this={oneTwoTwo}>1.2.2 Lending Players</h4>
    <div class="subBlock">
        <p>Managers lending players via trade is not considered illegal in this league, however it is highly frowned upon. Any conflict or trouble that occurs via the lending agreement is a matter that is to be resolved between the involved managers - the commissioner(s) are not responsible to step in to resolve the matter.</p>
    </div>

    <h4 bind:this={oneTwoThree}>1.2.3 Trade Deadline</h4>
    <div class="subBlock">
        <p>Game conclusion of Monday Night Football of week 11 of the regular season.</p>
    </div>

    <h4 bind:this={oneTwoFour}>1.2.4 Trade Restrictions</h4>
    <div class="subBlock">
        <p>No trade restrictions exist in the bylaws.</p>
    </div>

    <h4 bind:this={oneTwoFive}>1.2.5 Veto/Trade Process</h4>
    <div class="subBlock">
        <p>Trades are a free market agreement between the involved parties and, in general, will not be under a trade review. However, if a trade is clearly structured in a way to largely benefit one party over the other, the commissioner(s) have the right to step in to the situation and review and evaluate the transaction. Upon interview and review of the transaction and circumstance, the commissioner can determine the outcome under their discretion or bring it up to a league wide discussion.</p>
    </div>
    
    
    
    <h3 bind:this={oneThree}>1.3 Waiver Wire</h3>

    <p>FAAB (Free Agent Acquisition Budget) Waiver Wire system. Each team will be allocated a $100 season long budget, with $0 bids allowed. Bids will process daily at 8AM PST.</p>

    <p>Sunday and Monday players that clear waivers will become free agents for any manager to acquire at any point until their game is finished.</p>
    
    
    <h2 class="sectionHeading" bind:this={two}>Section 2 Drafting</h2>
    
    <h3 bind:this={twoOne}>2.1 Draft Order</h3>
    <p>Draft order is determined each season randomly via 100yardrush.com.</p>
    <p>The draft will be a snake draft.</p>
    <p>The draft will consist of 13 rounds, with 30 seconds allotted for each pick.</p>
    <p>Each manager is not required to draft all starting positions.</p>

    <h3 bind:this={twoTwo}>2.2 Draft Day Trades</h3>
    <p>No draft trades are allowed in this league, as we are a re-draft league.</p>
    <p>The only "trade" that is allowed for draft picks is a draft position swap, which must be communicated to the commissioner and league chat prior to the draft start time. Each manager is allowed ONE swap of position, and once two spots are swapped, that position is no longer available to be swapped with another manager.</p>
    
    <h2 class="sectionHeading" bind:this={three}>Section 3 Scoring System</h2>

    <h3 bind:this={threeOne}>3.1 Scoring System</h3>
    <p>This league is a half point per reception (.5 PPR) scoring format.</p>
    <p>Details of scoring are available on the Sleeper fantasy app.</p>
    <p>A scoring system change will require a majority league vote each season.</p>
    
    <h2 class="sectionHeading" bind:this={four}>Section 4 Postseason</h2>
    
    <h3 bind:this={fourOne}>4.1 Playoffs</h3>
    <p>6 teams will make the playoffs each season.</p>
    <p>The top two teams of the regular season will receive a first round bye.</p>
    <p>The first round of playoffs will commence in week 15 of the NFL season.</p>
    <p>Each playoff matchup will be a one-week winner advance tournament.</p>
    <p>Week 18 of the NFL season will not be played during the playoffs.</p>
    
    <h3 bind:this={fourTwo}>4.2 Seeding Tiebreakers</h3>
    <p>Teams finishing with the same records will have a tie breaker in effect that will go as followed:</p>

    <ol>
        <li>Overall Record</li>
        <li>Points For</li>
        <li>Higher Points Against</li>
    </ol>

    <p>This tiebreaker structure is a Sleeper default that cannot be changed - for more details, please visit <a href="https://support.sleeper.com/en/articles/2203518-how-do-playoff-teams-get-determined">Sleeper's help article on how playoff teams get determined</a>.</p>

    <h2 class="sectionHeading" bind:this={five}>Section 5 Tanking Policy</h2>
    
    <h3 bind:this={fiveOne}>5.1 League Tanking Policy</h3>
    <p>Each matchup's win loss results are extremely important - each manager is expected to field a full roster each week.</p>
    <p>As of September 2026, there are no explicit penalties/punishments for a manager not filling a full roster for their weekly matchup.</p>

    <h2 class="sectionHeading" bind:this={six}>Section 6 Replacing Managers</h2>
    
    <h3 bind:this={sixOne}>6.1 Removing Managers</h3>
    <p>Short of continuously failing to set a valid lineup, or confirmed collusion, no manager can be removed against their will. Each manager is expected to maintain a certain level of communication through the league chat and trade offers - be courteous and respectful of each others time and efforts.</p>
    
    <h3 bind:this={sixTwo}>6.2 Replacing Managers</h3>
    <p>When a manager needs to be replaced, the commisiooners will try to find a suitable candidate with some connection to at least a portion of the existing managers. Priority will be placed on managers who are eager to take on a league commitment and will be very active within the league.</p>

    <h2 class="sectionHeading" bind:this={seven}>Section 7 League Finances</h2>
    
    <h3 bind:this={sevenOne}>7.1 League Dues</h3>
    <p>League dues are set at {dues}$.</p>
    <p>Dues are collected via co-commissioner/Treasurer Jason Chu.</p>
    <p>League dues are to be submitted to the Treasurer prior to Draft start time - late dues will result in a FAAB penalty of 10% at the start of the season.</p>
    <p>League dues that are not paid by the start of the season will result in a $20 fine + an additional 20% reduction in FAAB.</p>
    <p>League dues that are not paid by the start of Week 2 (Thursday Night Football Kickoff) will result in an immediate suspension of the manager and a full lock on the roster. Manager will have the remainder of week 2 to submit their payment. Failure to submit payment will result in an immediate removal from the league.</p>

    <h3 bind:this={sevenTwo}>7.2 Payout</h3>
    <p>League payout will be separated to weekly bonuses and Championship results.</p>
    <p>Weekly high score bonus will be paid out $50 to the highest scoring manager each week.</p>
    <p>Final results payout are as follows:</p>
    <ul>
        <li>1st Place - $1000</li>
        <li>2nd Place - $500</li>
        <li>3rd Place - $200</li>
    </ul>
    <p>Pot splitting between the championship teams are an agreement between the managers and are not endorsed by the league. In fact the league highly discourages it. Any issues that arise after the fact will not be the responsibility of the commissioner to resolve, it will be a personal matter between the two that should be resolved between the managers.</p>

    <h3 bind:this={sevenThree}>7.3 Raising Dues</h3>
    <p>Raising league dues will require a unanimous vote. In the event that a manager is no longer financially comfortable with the buy in, please reach out to the commissioner or bring up a league wide vote to reduce the buy in prior to the season start.</p>

    <h2 class="sectionHeading" bind:this={eight}>Section 8 League Punishment</h2>

    <h3 bind:this={eightOne}>8.1 League Punishment</h3>
    <p>League punishment must be designated prior to the start of the season.</p>
    <p>No league punishment ideas will result in the default punishment of pie to the face by league members at a designated time/location.</p>

    <h3 bind:this={eightTwo}>8.2 Punishment Fulfilment</h3>
    <p>League punishment must be fulfilled between the conclusion of the fantasy season and the start of the following season.</p>
    <p>Any league punishment that has not been fulfilled may result in a removal from the league.</p>
    <p>Special consideration will be granted to the loser of the league if circumstances do not permit the manager to fulfill their punishment due to health, financial, or family situations, under the commissioner's discretion.</p>

    <h3 bind:this={eightThree}>8.3 Punishments</h3>
    <p>No physical or financial harm is to be done to the manager in the name of punishment.</p>
    <p>No permanent marks of any kind (tattoos) are to be considered a league punishment.</p>
    <p>Punishments should be lighthearted but humiliating and embarrassing in nature - this is a league to have fun, keep the punishments fun (for the rest of the league).</p>
    <p>By participating in this league, every manager is agreeing to the punishment agreed upon by the league.</p>
    <p>Any punishment suggestion will need unanimous agreement.</p>

</div>