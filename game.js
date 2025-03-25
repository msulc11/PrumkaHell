// Game state
const gameState = {
    playerName: "",
    health: 100,
    money: 200, // Starting money amount
    inventory: [],
    currentScene: 'intro',
    flags: {
        metProfessor: false,
        hasKey: false,
        defeatedGuard: false,
        visitedLibrary: false,
        visitedCafeteria: false,
        selectedBoss: null,
        foundEnchantedPen: false,
        attendedClass: false,
        talkedToStudent: false,
        disclaimerAccepted: false // New flag to track if disclaimer was accepted
    },
    projects: {
        semesterProject: {
            assigned: false,
            completed: false,
            dueDate: 10, // počet návštěv míst, které může hráč udělat před vypršením termínu
            remainingTime: 10,
            type: null, // "programming", "networking", "3dprinting", "math", "react"
            professor: null // "Lea", "Jiri", "Vaclav", "Ondrej"
        }
    },
    visitCounter: 0 // sleduje počet návštěv míst pro odpočet termínu projektu
};

// Informace o profesorech
const professors = {
    "Lea": {
        fullName: "Lea Klea",
        title: "Ředitelka a matematický génius",
        description: "Přísná ředitelka školy, která má vášeň pro matematiku. Její testy jsou obávané, ale její znalosti jsou neocenitelné.",
        image: "images/professor_lea.webp",
        role: "Ředitelka školy"
    },
    "Jiri": {
        fullName: "Jiří Príma",
        title: "Síťový expert s plešatou hlavou",
        description: "Guru síťových technologií s nezaměnitelnou plešatou hlavou. Nemá rád studenty jménem Jakub a nedůvěřuje bezdrátovým sítím.",
        image: "images/professor_jiri.webp",
        role: "Síťový expert"
    },
    "Vaclav": {
        fullName: "Václav Polštář",
        title: "Vypadá jako student, ale je učitel",
        description: "Mladý a energický učitel, kterého si často pletou se studentem. Ovládá moderní webové technologie a má lásku pro frontend.",
        image: "images/professor_vaclav.jpg",
        role: "Frontend specialista"
    },
    "Ondrej": {
        fullName: "Ondřej Komínek",
        title: "Programovací génius",
        description: "Přísný na kvalitu kódu a efektivitu algoritmů. Je posedlý čistým kódem a nepřijímá výmluvy za špatné programování.",
        image: "images/professor_ondrej.jpg",
        role: "Backend vývojář"
    },
    "JJ": {
        fullName: "JJ",
        title: "Mistr operačních systémů a bojových umění",
        description: "Učitel operačních systémů, který je také držitelem černého pásu v karate. Na jeho hodinách se naučíš jak optimalizovat kernel, tak i jak se bránit před útokem. Je to frajer, ke kterému vzhlížejí studenti i učitelé.",
        image: "images/professor_default.jpg", // Použijeme náhradní obrázek, dokud nebude k dispozici skutečný
        role: "Specialista na operační systémy"
    }
};

// DOM elements
const nameInputContainer = document.getElementById('nameInputContainer');
const playerNameInput = document.getElementById('playerNameInput');
const confirmNameButton = document.getElementById('confirmNameButton');
const gameScreen = document.getElementById('gameScreen');
const sceneTextElement = document.getElementById('sceneText');
const sceneImageElement = document.getElementById('sceneImage');
const choicesContainer = document.getElementById('choicesContainer');
const healthBarElement = document.getElementById('healthBar');
const healthTextElement = document.getElementById('healthText');
const inventoryItemsElement = document.getElementById('inventoryItems');
const inventoryItemsDisplayElement = document.getElementById('inventoryItemsDisplay');
const startButton = document.getElementById('startButton');
const moneyElement = document.getElementById('money'); // New money display element

// Disclaimer setup
function showDisclaimer() {
    // Create disclaimer overlay
    const disclaimerOverlay = document.createElement('div');
    disclaimerOverlay.style.position = 'fixed';
    disclaimerOverlay.style.top = '0';
    disclaimerOverlay.style.left = '0';
    disclaimerOverlay.style.width = '100%';
    disclaimerOverlay.style.height = '100%';
    disclaimerOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    disclaimerOverlay.style.zIndex = '9999';
    disclaimerOverlay.style.display = 'flex';
    disclaimerOverlay.style.justifyContent = 'center';
    disclaimerOverlay.style.alignItems = 'center';
    
    // Create content container with improved mobile styling
    const disclaimerContent = document.createElement('div');
    disclaimerContent.style.backgroundColor = '#ffeb3b';
    disclaimerContent.style.padding = '30px';
    disclaimerContent.style.borderRadius = '10px';
    disclaimerContent.style.maxWidth = '90%';
    disclaimerContent.style.width = '500px';
    disclaimerContent.style.maxHeight = '90vh';
    disclaimerContent.style.overflowY = 'auto';
    disclaimerContent.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    
    // Add responsive disclaimer content
    disclaimerContent.innerHTML = `
        <h2 style="color:#212121; margin-top:0; font-size:clamp(20px, 5vw, 28px); text-align:center; margin-bottom:20px;">Právní upozornění</h2>
        <div style="color:#333; font-size:clamp(14px, 4vw, 16px); line-height:1.5; margin-bottom:15px;">
            <p style="margin-bottom:15px;">pouze pro zábavní a vzdělávací účely. Veškeré postavy, události, místa a situace v této hře jsou smyšlené a jakákoliv podobnost se skutečnými osobami, žijícími či zesnulými, nebo skutečnými událostmi je čistě náhodná.</p>
            
            <p style="margin-bottom:15px;">Jména a charakteristiky postav nemají žádnou souvislost se skutečnými osobami a nepředstavují skutečné zaměstnance nebo studenty žádné vzdělávací instituce.</p>
            
            <p style="margin-bottom:15px;">Zadáním svého jména souhlasíte s jeho použitím výhradně v rámci této hry pro personalizaci herního zážitku. Vaše jméno nebude nikam odesíláno, ukládáno na server ani sdíleno s třetími stranami.</p>
            
            <p style="margin-bottom:15px;">Tato hra je určena pouze pro zábavu a žádným způsobem nereprezentuje skutečné vzdělávací instituce, jejich zaměstnance, programy nebo postupy.</p>
        </div>
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; margin-top:25px;">
            <button id="acceptDisclaimer" style="flex-grow:1; min-width:120px; background-color:#4caf50; color:white; border:none; padding:12px 20px; border-radius:50px; font-size:clamp(14px, 4vw, 16px); font-weight:bold; cursor:pointer; box-shadow:0 4px 12px rgba(76, 175, 80, 0.3); transition: all 0.2s ease;">Souhlasím</button>
            <button id="rejectDisclaimer" style="flex-grow:1; min-width:120px; background-color:#f44336; color:white; border:none; padding:12px 20px; border-radius:50px; font-size:clamp(14px, 4vw, 16px); font-weight:bold; cursor:pointer; box-shadow:0 4px 12px rgba(244, 67, 54, 0.3); transition: all 0.2s ease;">Nesouhlasím</button>
        </div>
    `;

    // Add hover effects for buttons
    disclaimerContent.querySelector('#acceptDisclaimer').addEventListener('mouseover', function() {
        this.style.backgroundColor = '#fb8c00';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 14px rgba(255, 152, 0, 0.4)';
    });
    
    disclaimerContent.querySelector('#acceptDisclaimer').addEventListener('mouseout', function() {
        this.style.backgroundColor = '#ff9800';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
    });
    
    disclaimerContent.querySelector('#rejectDisclaimer').addEventListener('mouseover', function() {
        this.style.backgroundColor = '#e53935';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 14px rgba(244, 67, 54, 0.4)';
    });
    
    disclaimerContent.querySelector('#rejectDisclaimer').addEventListener('mouseout', function() {
        this.style.backgroundColor = '#f44336';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)';
    });

    // Add content to overlay
    disclaimerOverlay.appendChild(disclaimerContent);
    
    // Add overlay to body
    document.body.appendChild(disclaimerOverlay);
    
    // Add event listeners
    document.getElementById('acceptDisclaimer').addEventListener('click', () => {
        gameState.flags.disclaimerAccepted = true;
        document.body.removeChild(disclaimerOverlay);
        // Continue with game initialization
        initializeGame();
    });
    
    document.getElementById('rejectDisclaimer').addEventListener('click', () => {
        // Show rejection message
        disclaimerContent.innerHTML = `
            <h2 style="color:#212121; margin-top:0; font-size:28px; text-align:center; margin-bottom:20px;">Ukončení hry</h2>
            <p style="color:#333; font-size:16px; line-height:1.5; margin-bottom:15px; font-weight:400;">Pro hraní této hry je nutné souhlasit s právním upozorněním.</p>
            <p style="color:#333; font-size:16px; line-height:1.5; margin-bottom:15px; font-weight:400;">Hra bude nyní ukončena. Děkujeme za pochopení.</p>
            <div style="margin-top:25px; text-align:center;">
                <button id="closeGame" style="background-color:#ff9800; color:white; border:none; padding:12px 24px; border-radius:50px; font-size:16px; font-weight:bold; cursor:pointer; box-shadow:0 4px 12px rgba(255, 152, 0, 0.3); transition: all 0.2s ease;">Zavřít</button>
            </div>
        `;
        
        // Add hover effects for the close button
        disclaimerContent.querySelector('#closeGame').addEventListener('mouseover', function() {
            this.style.backgroundColor = '#fb8c00';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 14px rgba(255, 152, 0, 0.4)';
        });
        
        disclaimerContent.querySelector('#closeGame').addEventListener('mouseout', function() {
            this.style.backgroundColor = '#ff9800';
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
        });
        
        document.getElementById('closeGame').addEventListener('click', () => {
            // Redirect to some exit page or just stay with disabled game
            window.location.href = 'index.html'; // Redirect to main site
            // Alternatively, you could just disable game elements
        });
    });
}

// Modify initialize game function
function initializeGame() {
    // Only proceed if disclaimer is accepted
    if (!gameState.flags.disclaimerAccepted) {
        return;
    }
    
    // Original initialization code
    confirmNameButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName.length > 0) {
            gameState.playerName = playerName;
            nameInputContainer.style.display = 'none';
            // Make the game screen visible before loading the boss selection
            gameScreen.style.display = 'flex';
            // Show boss selection first
            loadScene('chooseFinalBoss');
        } else {
            alert("Zadej svoje jméno pro pokračování!");
        }
    });

    // Allow pressing Enter to submit name
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            confirmNameButton.click();
        }
    });

    // Initialize game
    startButton.addEventListener('click', () => {
        loadScene('intro');
    });
    
    // Initialize displays
    updateHealthDisplay();
    updateMoneyDisplay();
    
    // Přidej maturitní otázky
    addExamQuestions();
    
    // Přidej styly pro maturitu
    injectExamStyles();
}

// Initialize health display
updateHealthDisplay();

// Start the game with the disclaimer
window.onload = function() {
    showDisclaimer();
};

// Function to start the game
function startGame() {
    // No need to set gameScreen display here since it's already visible
    loadScene('intro');
}

// Scene definitions
const scenes = {
    chooseFinalBoss: {
        text: function() {
            return `Vítej, ${gameState.playerName}! Než začneš své dobrodružství na průmyslové škole, vyber si, kterého profesora chceš mít na závěrečné zkoušce:`;
        },
        image: "images/finalboss.jpg",
        render: function() {
            // Speciální funkce pro vykreslení profesorů s obrázky
            const sceneText = document.getElementById('sceneText');
            const choicesContainer = document.getElementById('choicesContainer');
            
            // Vyčistit kontejnery
            sceneText.innerHTML = `<p>${this.text()}</p>`;
            choicesContainer.innerHTML = '';
            
            // Vytvořit mřížku pro profesory
            const professorsGrid = document.createElement('div');
            professorsGrid.className = 'professors-grid';
            
            // Přidat karty profesorů
            for (const [id, professor] of Object.entries(professors)) {
                const card = document.createElement('div');
                card.className = 'professor-card';
                card.setAttribute('data-professor-id', id);
                
                card.innerHTML = `
                    <img src="${professor.image}" alt="${professor.fullName}" class="professor-image">
                    <div class="professor-info">
                        <div class="professor-name">${professor.fullName}</div>
                        <div class="professor-description">${professor.description}</div>
                        <button class="professor-select-btn">Vybrat</button>
                    </div>
                `;
                
                // Přidat akci na tlačítko
                const selectBtn = card.querySelector('.professor-select-btn');
                selectBtn.addEventListener('click', () => {
                    gameState.flags.selectedBoss = id;
                    loadScene('intro');
                });
                
                professorsGrid.appendChild(card);
            }
            
            // Přidat mřížku do scény
            sceneText.appendChild(professorsGrid);
        },
        choices: [] // Prázdné volby, protože používáme vlastní tlačítka v kartách
    },
    
    intro: {
        text: function() {
            const bossNames = {
                "Lea": "ředitelky Ley Klea",
                "Jiri": "profesora Jiřího Prímy",
                "Vaclav": "profesora Václava Polštáře", 
                "Ondrej": "profesora Ondřeje Komínka",
                "JJ": "profesora JJ"
            };
            
            const bossName = bossNames[gameState.flags.selectedBoss] || "profesorem";
            
            return `Vítej v dobrodružství na průmyslové škole, ${gameState.playerName}! Tvoje cesta začíná jako nový student/ka, plný/á očekávání a nervozity. Před tebou stojí mnoho výzev, ale největší bude dokázat složit zkoušku u ${bossName}. Tvoje rozhodnutí budou ovlivňovat tvůj příběh a určí, zda uspěješ. Připrav se na svou cestu!`;
        },
        image: "images/school_entrance.jpg",
        choices: [
            { text: "Vstoupit do školy", nextScene: "mainHall" }
        ]
    },
    
    
    talkStudents: {
        text: function() {
            return `Přistoupíš ke skupince nervózně vypadajících studentů. "Dávej si tam pozor," zašeptá jeden z nich. "Dneska je profesor v mizerné náladě. Říkají, že každý, kdo nezvládne jeho překvapivý test, dostane odpoledky na měsíc!" Jiný student zmíní, že v knihovně by mohl být nějaký tajný tahák.`;
        },
        image: "images/students_talking.jpg",
        choices: [
            { text: "Poděkuj jim a vejdi do budovy", nextScene: "mainHall" },
            { text: "Zeptej se více na profesora", nextScene: "askAboutPrumka" }
        ]
    },
    
    mainHall: {
        text: function() {
            let baseText = `Stojíš v hlavní hale průmyslové školy. Vzduch je naplněn směsicí vzrušení a stresu. Někteří studenti pospíchají na hodiny, zatímco jiní posedávají a diskutují o svých projektech. Vidíš několik směrů, kterými se můžeš vydat:
            
- Učebna U5, kde má pravděpodobně začít tvoje první hodina
- FABLAB, kde studenti pracují na svých technických projektech
- Učebna MIT, kde probíhají různé typy přednášek
- Školní bufet, kde si můžeš koupit občerstvení a energetické nápoje`;

            // Přidat informaci o projektu, pokud je zadaný
            if (gameState.projects.semesterProject.assigned && !gameState.projects.semesterProject.completed) {
                const project = gameState.projects.semesterProject;
                const projectTypes = {
                    "php": "programovací",
                    "networking": "síťový",
                    "3dprinting": "3D tiskový", 
                    "math": "matematický",
                    "react": "React"
                };
                
                baseText += `\n\nMáš zadaný ${projectTypes[project.type]} projekt, který musíš dokončit. Zbývá ti ${project.remainingTime} dní do termínu odevzdání.`;
                
                if (project.remainingTime <= 3) {
                    baseText += ` Měl(a) bys na něm začít pracovat co nejdříve!`;
                }
            }
            
            return baseText;
        },
        image: "images/school_hallway.jpg",
        render: function() {
            // Standardní renderování scény
            const sceneText = document.getElementById('sceneText');
            const choicesContainer = document.getElementById('choicesContainer');
            const sceneImage = document.getElementById('sceneImage');
            
            // Nastavení obrázku chodby
            sceneImage.style.backgroundImage = `url('${this.image}')`;
            
            // Vyčistit kontejnery
            sceneText.innerHTML = `<p>${this.text()}</p>`;
            choicesContainer.innerHTML = '';
            
            // Zobrazit vybraného profesora, pokud existuje
            if (gameState.flags.selectedBoss) {
                const professor = professors[gameState.flags.selectedBoss];
                const professorDisplay = document.createElement('div');
                professorDisplay.className = 'professor-display';
                
                professorDisplay.innerHTML = `
                    <img src="${professor.image}" alt="${professor.fullName}" class="professor-display-image">
                    <div class="professor-display-info">
                        <div class="professor-display-name">${professor.fullName}</div>
                        <div class="professor-display-role">${professor.role}</div>
                    </div>
                `;
                
                sceneText.appendChild(professorDisplay);
            }
            
            // Přidat volby
            const choices = typeof this.choices === 'function' ? this.choices() : this.choices;
            
            choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                
                button.addEventListener('click', () => {
                    // Run choice action if exists
                    if (choice.action) {
                        choice.action();
                    }
                    
                    // Determine next scene - it can be a string or a function that returns a string
                    const nextScene = typeof choice.nextScene === 'function' 
                        ? choice.nextScene() 
                        : choice.nextScene;
                    
                    // If nextScene is defined, load it (might not be if action handles navigation)
                    if (nextScene) {
                        loadScene(nextScene);
                    }
                });
                
                choicesContainer.appendChild(button);
            });
        },
        choices: function() {
            let choices = [
                { text: "Jít na hodinu do učebny U5", nextScene: "classroom", action: () => { 
                    updateProjectTime();
                } },
                { text: "Prozkoumat FABLAB", nextScene: "fablab", action: () => { 
                    updateProjectTime();
                } },
                { text: "Podívat se do učebny MIT", nextScene: "mit", action: () => { 
                    updateProjectTime();
                } },
                { text: "Jít do bufetu", nextScene: "bufet", action: () => { 
                    updateProjectTime();
                } },
                { text: "Promluvit si s někým", nextScene: function() {
                    updateProjectTime();
                    if (!gameState.talkedToStudent) {
                        gameState.talkedToStudent = true;
                        return "talkToStudent";
                    } else {
                        return "eavesdrop";
                    }
                }},
                { text: "Najít si brigádu (vydělat peníze)", nextScene: "partTimeJob" },
                { text: "Zkusit štěstí v kartách (gambling)", nextScene: "gambling" },
                { text: "Opravy počítačů (high-risk, high-reward)", nextScene: "computerRepair" }
            ];
            
            // Přidat možnost návštěvy kanceláře profesora pokud nemáme ještě zadaný projekt
            if (!gameState.projects.semesterProject.assigned) {
                choices.push({
                    text: "Navštívit kancelář profesora (získat semestrální projekt)",
                    nextScene: "professorOffice"
                });
            }
            
            // Přidat možnost pracovat na projektu, pokud je zadaný
            if (gameState.projects.semesterProject.assigned && !gameState.projects.semesterProject.completed) {
                const projectType = gameState.projects.semesterProject.type;
                
                if (projectType === "php") {
                    choices.push({
                        text: "Pracovat na PHP projektu",
                        nextScene: "workOnPHPProject"
                    });
                } else if (projectType === "networking") {
                    choices.push({
                        text: "Pracovat na síťovém projektu",
                        nextScene: "workOnNetworkingProject"
                    });
                } else if (projectType === "3dprinting") {
                    choices.push({
                        text: "Pracovat na 3D tiskovém projektu",
                        nextScene: "workOn3DPrintingProject"
                    });
                } else if (projectType === "math") {
                    choices.push({
                        text: "Pracovat na matematickém projektu",
                        nextScene: "workOnMathProject"
                    });
                } else if (projectType === "react") {
                    choices.push({
                        text: "Pracovat na React projektu",
                        nextScene: "workOnReactProject"
                    });
                }
            }
            
            // Přidat možnost odevzdat projekt, pokud jsme na něm pracovali
            if (gameState.projects.semesterProject.assigned && !gameState.projects.semesterProject.completed) {
                const projectType = gameState.projects.semesterProject.type;
                
                if ((projectType === "php" && gameState.inventory.includes("Rozpracovaný PHP projekt")) || 
                   (projectType === "networking" && gameState.inventory.includes("Rozpracovaný síťový projekt")) ||
                   (projectType === "3dprinting" && gameState.inventory.includes("Rozpracovaný 3D model")) ||
                   (projectType === "math" && gameState.inventory.includes("Rozpracované matematické řešení")) ||
                   (projectType === "react" && gameState.inventory.includes("Rozpracovaný React projekt"))) {
                    choices.push({
                        text: "Odevzdat semestrální projekt profesorovi",
                        nextScene: "submitProject"
                    });
                }
            }
            
            // Add final exam option if player has at least one required item
            const readiness = checkRequiredItems();
            if (readiness.count > 0) {
                choices.push({ 
                    text: `Jít na finální zkoušku (připravenost: ${readiness.count}/${readiness.total})`, 
                    nextScene: "prepareForFinalExam" 
                });
            }
            
            // Add option to work on JJ's OS project if assigned
            if (gameState.projects.semesterProject.assigned && !gameState.projects.semesterProject.completed) {
                const projectType = gameState.projects.semesterProject.type;
                
                // ... existing project types ...
                
                if (projectType === "os") {
                    choices.push({
                        text: "Pracovat na projektu operačních systémů",
                        nextScene: "workOnOSProject"
                    });
                }
            }
            
            return choices;
        }
    },
    
    bufet: {
        text: function() {
            return `Vstupuješ do školního bufetu, který je plný studentů doplňujících energii mezi hodinami. Za pultem stojí usměvavá paní a nabízí různé druhy občerstvení. Na tabuli vidíš nabídku:

- Nuget  (40 Kč) - 100% masa, +10 zdraví
- Tiger energeťák (25 Kč) - pomůže se soustředěním, +15 zdraví
- Bageta se šunkou (60 Kč) - výživná svačina, +20 zdraví
- Sušenky (15 Kč) - rychlá svačina, +5 zdraví
- Energetické Gumídky (120 Kč) - speciální přípravek pro studenty v nouzi, +50 zdraví

Máš u sebe ${gameState.money} Kč.`;
        },
        image: "images/school_cafeteria.jpg",
        choices: function() {
            const choices = [];
            
            // Add purchase options only if player has enough money
            if (gameState.money >= 40) {
                choices.push({ text: "Koupit Nuget (40 Kč, +10 zdraví)", nextScene: "mainHall", action: () => {
                    addToInventory("Nuget");
                    updateHealth(10);
                    updateMoney(-40);
                }});
            }
            
            if (gameState.money >= 25) {
                choices.push({ text: "Koupit Tiger energeťák (25 Kč, +15 zdraví)", nextScene: "mainHall", action: () => {
                    addToInventory("Tiger energeťák");
                    updateHealth(15);
                    updateMoney(-25);
                }});
            }
            
            if (gameState.money >= 60) {
                choices.push({ text: "Koupit bagetu (60 Kč, +20 zdraví)", nextScene: "mainHall", action: () => {
                    updateHealth(20);
                    updateMoney(-60);
                }});
            }
            
            if (gameState.money >= 15) {
                choices.push({ text: "Koupit sušenky (15 Kč, +5 zdraví)", nextScene: "mainHall", action: () => {
                    updateHealth(5);
                    updateMoney(-15);
                }});
            }
            
            // Add special health recovery item
            if (gameState.money >= 120) {
                choices.push({ text: "Koupit Energetické Gumídky (120 Kč, +50 zdraví)", nextScene: "mainHall", action: () => {
                    updateHealth(50);
                    updateMoney(-120);
                    alert("Cítíš, jak se ti po snědení speciálních gumídků vrací energie! Tvé zdraví se výrazně zlepšilo.");
                }});
            }
            
            // Always allow returning to the main hall
            choices.push({ text: "Vrátit se do hlavní haly", nextScene: "mainHall" });
            
            return choices;
        }
    },
    
    classroom: {
        text: function() {
            return `Vstoupíš do učebny U5, kde už sedí několik studentů. Místnost je vybavena moderní technologií - počítače s velkými monitory, interaktivní tabule a uprostřed učitelský stůl. Na zdi visí plakáty s počítačovými komponenty a síťovými diagramy. Profesor ještě nedorazil, takže máš čas se rozkoukat.`;
        },
        image: "images/computer_classroom.jpg",
        choices: [
            { text: "Sednout si a počkat na profesora", nextScene: "standardQuiz", action: () => {
                gameState.attendedClass = true;
            }},
            { text: "Promluvit si se spolužáky", nextScene: "askAboutTeachers" },
            { text: "Odejít zpět na chodbu", nextScene: "mainHall" }
        ]
    },
    
    fablab: {
        text: function() {
            return `FABLAB je plný tvořivé energie. Všude kolem jsou 3D tiskárny, laserové řezačky, mikrokontroléry a elektronické součástky. Několik studentů pracuje na různých projektech - někdo sestavuje robota, další programuje Arduino, jiní navrhují 3D modely. V rohu místnosti vidíš staršího studenta, který vypadá, že tady tráví hodně času.`;
        },
        image: "images/fablab.jpg",
        choices: [
            { text: "Promluvit si se starším studentem", nextScene: "talkToSenior" },
            { text: "Prozkoumat 3D tiskárny", nextScene: "explore3DPrinters", action: () => {
                addToInventory("Základní znalosti 3D tisku");
            }},
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    explore3DPrinters: {
        text: function() {
            return `Přistoupíš blíže k 3D tiskárnám a fascinovaně pozoruješ, jak vrstvu po vrstvě vytvářejí složité objekty. Jeden ze studentů si všimne tvého zájmu a vysvětlí ti základy 3D tisku - jak fungují různé typy tiskáren, jaké materiály se používají a jak se připravují 3D modely. Dokonce ti ukáže několik svých výtvorů. Cítíš, že jsi získal/a nové znalosti, které by se ti mohly hodit.`;
        },
        image: "images/3d_printer.webp",
        choices: [
            { text: "Vrátit se do hlavní části FABLABu", nextScene: "fablab" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    mit: {
        text: function() {
            return `Vstupuješ do menší učebny MIT. Místnost je útulná, s pouze několika počítači, na nichž běží staré textové editory. Na tabuli jsou napsány příkazy v assembleru a strojovém kódu. U počítačů sedí pár soustředěných studentů, kteří se snaží pochopit nízkoúrovňové programování. Je vidět, že tady se učí assembler v jeho nejčistší podobě.`;
        },
        image: "images/coding_classroom.jpg",
        choices: [
            { text: "Přisednout si a studovat", nextScene: "studyInMIT", action: () => {
                updateHealth(-5);
                // Získání náhodného předmětu z učebních materiálů
                let studyItems = ["Poznámky ze sítí", "Poznámky z programování", "Poznámky z assembleru"];
                let randomItem = studyItems[Math.floor(Math.random() * studyItems.length)];
                addToInventory(randomItem);
            }},
            { text: "Promluvit si s někým", nextScene: "talkInMIT" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    studyInMIT: {
        text: function() {
            return `Sedneš si k jednomu z volných počítačů a začneš studovat assembler. Po hodině procházení kódu a experimentování s jednoduchými příkazy máš pocit, že se tvůj mozek přehřívá, ale získal/a jsi cenné znalosti o nízkoúrovňovém programování. Našel/našla jsi také užitečné poznámky, které jsi si vzal/a s sebou.`;
        },
        image: "images/studying_code.jpg",
        choices: [
            { text: "Pokračovat ve studiu (získat další materiály)", nextScene: "studyMore", action: () => {
                updateHealth(-10);
                // Získání náhodného předmětu z učebních materiálů
                let studyItems = ["Poznámky ze sítí", "Poznámky z programování", "Poznámky z assembleru"];
                let randomItem = studyItems[Math.floor(Math.random() * studyItems.length)];
                addToInventory(randomItem);
            }},
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    studyMore: {
        text: function() {
            return `Pokračuješ ve studiu assembleru další hodinu. Tvé oči už pálí z neustálého sledování přísně formátovaného kódu a řádkových adres, ale cítíš, že tvé pochopení této základní programovací vrstvy roste. Našel/našla jsi další užitečné poznámky a kódy, které si můžeš prohlédnout později.`;
        },
        image: "images/tired_studying.jpg",
        choices: [
            { text: "Vzít si přestávku a vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    talkInMIT: {
        text: function() {
            return `Přistoupíš k jednomu ze studentů, který vypadá přátelsky. Představíš se jako nový/á student/ka. "Já jsem Petr," odpoví s úsměvem. "První den, co? Tahle škola může být náročná, ale stojí to za to. Právě dokončuji projekt pro Komínka - ten chlap je posedlý čistým kódem a efektivitou. Jestli budeš mít jeho hodiny, dej si pozor na překlepy a neefektivní algoritmy."`;
        },
        image: "images/student_conversation.jpg",
        choices: [
            { text: "Zeptat se na další profesory", nextScene: "askMoreTeachers" },
            { text: "Poděkovat a jít studovat", nextScene: "studyInMIT", action: () => {
                // Získání náhodného předmětu z učebních materiálů
                let studyItems = ["Poznámky ze sítí", "Poznámky z programování", "Matematické vzorce"];
                let randomItem = studyItems[Math.floor(Math.random() * studyItems.length)];
                addToInventory(randomItem);
            }},
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    askMoreTeachers: {
        text: function() {
            return `"Jo, profesoři," povzdechne si Petr. "Príma je posedlý sítěmi - jestli se octneš na jeho hodině a jmenuješ se Jakub, tak se radši ani neozývej. Má s tímhle jménem nějaký problém. Klea je ředitelka a matematický génius, ale její testy jsou noční můra. Polštář? Ten týpek vypadá jako by sem ještě chodil studovat - hodně lidí si ho plete se studentem. A JJ? Ten je úplně jiná liga - učí operační systémy a když se někdy naštve, ukáže pár karate chvatů. Je to totální frajer."`;
        },
        image: "images/talking_about_teachers.jpg",
        choices: [
            { text: "Poděkovat a jít studovat", nextScene: "studyInMIT", action: () => {
                // Získání náhodného předmětu z učebních materiálů
                let studyItems = ["Poznámky ze sítí", "Poznámky z programování", "Matematické vzorce"];
                let randomItem = studyItems[Math.floor(Math.random() * studyItems.length)];
                addToInventory(randomItem);
            }},
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    askAboutTeachers: {
        text: function() {
            return `"Každý profesor má své specifické požadavky," vysvětluje spolužák. "Komínek ti nedovolí používat zápisky při testech, všechno musíš znát zpaměti. Príma je posedlý sítěmi a má pleš, na kterou je celkem hrdý - ale nikdy se nedívej přímo na ni. A pokud se jmenuješ Jakub, tak radši ani nemluv. Klea je ředitelka a matematický génius, ale dává těžké testy na seminářích a přidává odpoledky. Polštář? Ten vypadá jako žák, ale je to učitel - hodně lidí si ho plete se studentem."`;
        },
        image: "images/classroom_advice.jpg",
        choices: [
            { text: "Poděkovat za informace a jít na hodinu", nextScene: "classroom" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    askRestroom: {
        text: function() {
            return `Zvedneš ruku a požádáš o povolení jít na toaletu. Profesor ti věnuje podezřívavý pohled, ale nakonec souhlasí. Na toaletě si opláchneš obličej studenou vodou a snažíš se uklidnit. Máš pár minut, abys vymyslel/a strategii na zvládnutí testu.`;
        },
        image: "images/restroom_break.jpg",
        choices: [
            { text: "Vrátit se do třídy a použít standardní znalosti", nextScene: "standardQuiz" },
            { text: "Prohledat batoh pro něco užitečného", nextScene: "searchBackpack" }
        ]
    },
    
    searchBackpack: {
        text: function() {
            let additionalText = "";
            if (gameState.inventory.includes("Poznámky ze sítí")) {
                additionalText = " Nacházíš také poznámky ze sítí, které by ti mohly pomoci, pokud je test na toto téma.";
            }
            if (gameState.inventory.includes("Tiger energeťák")) {
                additionalText += " Máš také Tiger energeťák, který by ti mohl pomoci se soustředit.";
            }
            if (gameState.inventory.includes("Nuget tyčinka")) {
                additionalText += " Nuget tyčinka v tvém batohu by ti mohla dodat rychlou energii.";
            }
            
            return `Rychle prohledáváš svůj batoh.${additionalText} Čas ubíhá a musíš se vrátit do třídy.`;
        },
        image: "images/backpack_search.jpg",
        choices: [
            { text: "Vrátit se do třídy připraven/a", nextScene: "preparedQuiz", action: () => {
                updateHealth(5);
            }},
            { text: "Vrátit se do třídy nepřipraven/a", nextScene: "standardQuiz" }
        ]
    },
    
    preparedQuiz: {
        text: function() {
            return `Díky chvilce na toaletě a věcem, které jsi našel/našla v batohu, se cítíš lépe připraven/a na test. Když se vrátíš do třídy, profesor ti dá testový papír se zlomyslným úsměvem. Test je náročný, ale díky své přípravě zvládáš odpovědět na většinu otázek.`;
        },
        image: "",
        choices: [
            { text: "Odevzdat test", nextScene: "betterTestResults" }
        ]
    },
    
    betterTestResults: {
        text: function() {
            return `Profesor projde testy a vrátí ti tvůj s překvapivě dobrým hodnocením. "Hmm, nečekal jsem takový výkon od nového studenta," mumlá. Cítíš hrdost na to, že jsi zvládl/a první výzvu na průmce.`;
        },
        image: "",
        choices: [
            { text: "Pokračovat ve studiu", nextScene: "askToLearn" }
        ]
    },
    
    eavesdrop: {
        text: function() {
            return `Posloucháš rozhovory ostatních studentů. "Slyšel jsi, že Príma zase vyhodil tři Jakuby ze třídy?" říká jeden student. "Jo, a prý Komínek plánuje překvapivý test z paměti - žádné poznámky nebudou povoleny," odpovídá jiný. "A Polštář zase rozdává odpoledky jako popcorn. Už mám pětkrát týdně doučování z matiky!"`;
        },
        image: "",
        choices: [
            { text: "Jít na hodinu do U5", nextScene: "classroom" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    standardQuiz: {
        text: function() {
            return `Učitel zadal test. Test je brutálně těžký. Bojuješ se složitými problémy a cítíš, jak ti s každou otázkou ubývá sebevědomí. Když vyprší čas, profesor vybírá papíry s pochmurným výrazem. "Zklamání, jak jsem od nových studentů očekával," mumlá profesor.`;
        },
        image: "",
        action: () => {
            updateHealth(-20);
        },
        choices: [
            { text: "Přijmout kritiku a slíbit si zlepšení", nextScene: "acceptCriticism" },
            { text: "Zpochybnit profesorovo hodnocení", nextScene: "challengeTeacher" }
        ]
    },
    
    acceptCriticism: {
        text: function() {
            return `"Omlouvám se, budu se více snažit," odpovíš. Profesor kývne, trochu překvapen tvou pokorou. "To je postoj, který ocením. Průmyslovka není snadná, ale studenti s odhodláním obvykle uspějí." Dá ti několik učebních materiálů navíc, které ti pomohou lépe pochopit látku.`;
        },
        image: "",
        choices: [
            { text: "Jít do učebny MIT studovat", nextScene: "mit" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    challengeTeacher: {
        text: function() {
            return `"Myslím, že test nebyl úplně fér pro nové studenty," odvážíš se říct. Profesorovy oči se zúží. "Na této škole se netoleruje výmluvy, ${gameState.playerName}. Buď se přizpůsobíš standardům, nebo se přizpůsobíš dveřím." Třída ztichne a ty cítíš, jak tvoje tvář rudne.`;
        },
        image: "",
        action: () => {
            updateHealth(-10);
        },
        choices: [
            { text: "Omluvit se a odejít", nextScene: "apologizeAndLeave" },
            { text: "Odejít beze slova", nextScene: "leaveInSilence" }
        ]
    },
    
    apologizeAndLeave: {
        text: function() {
            return `"Omlouvám se, pane profesore," řekneš rychle. "Bylo to nevhodné." Profesor lehce přikývne, přijímaje tvou omluvu, ale je zřejmé, že jsi u něj ztratil/a body. Rychle opouštíš třídu, rozhodnut/a najít způsob, jak situaci napravit.`;
        },
        image: "",
        choices: [
            { text: "Jít studovat do učebny MIT", nextScene: "mit" },
            { text: "Prozkoumat FABLAB", nextScene: "fablab" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    leaveInSilence: {
        text: function() {
            return `Mlčky sbíráš své věci a opouštíš třídu. Za tebou slyšíš profesorovo pohrdavé odfrknutí. Tvé mlčení může být interpretováno jako vzdor, a to ti nepomůže v budoucích hodinách. Budeš muset najít způsob, jak se rehabilitovat.`;
        },
        image: "",
        action: () => {
            updateHealth(-5);
        },
        choices: [
            { text: "Jít studovat do učebny MIT", nextScene: "mit" },
            { text: "Prozkoumat FABLAB", nextScene: "fablab" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    talkToStudent: {
        text: function() {
            return `Přistoupíš k přátelsky vypadajícímu studentovi. "Ahoj, jsem tu nový/á," představíš se. "Já jsem Tomáš," odpoví s úsměvem. "První den? Neboj, každý si tím prošel. Jestli chceš tip - v bufetu mají skvělé energeťáky, které ti pomůžou přežít dlouhé hodiny. A FABLAB je super místo, kde můžeš pracovat na svých projektech. Máš už vybráno, kterého profesora budeš mít na závěrečnou zkoušku?"`;
        },
        image: "",
        choices: [
            { text: "Zeptat se na profesory", nextScene: "askAboutTeachers" },
            { text: "Poděkovat a jít na hodinu", nextScene: "classroom" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    talkToSenior: {
        text: function() {
            return `Představíš se staršímu studentovi, který má na sobě tričko s logem školy a několik odznaků z různých technických soutěží. "Já jsem Petr, poslední ročník," říká. "Hledáš nějakou pomoc? FABLAB je skvělé místo, kde můžeš rozvíjet praktické dovednosti. Většina profesorů to ocení víc než slepé memorování faktů. Zvlášť Komínek, ten je posedlý tím, abys všechno znal zpaměti."`;
        },
        image: "",
        choices: [
            { text: "Zeptat se na 3D tiskárny", nextScene: "explore3DPrinters" },
            { text: "Zeptat se na rady pro nové studenty", nextScene: "askForAdvice" },
            { text: "Poděkovat a vrátit se do hlavní části FABLABu", nextScene: "fablab" }
        ]
    },
    
    askForAdvice: {
        text: function() {
            return `"Rady pro nováčky?" zamyslí se Petr. "Určitě si udělej dobrý vztah s profesory - zvlášť s tím, kterého budeš mít na závěrečné zkoušce. Príma má spadeno na každého Jakuba, vždycky se ujisti, že máš nějaký energeťák před dlouhými hodinami, a hlavně - nauč se praktické věci. V téhle škole jsou teoretické znalosti důležité, ale aplikace je ještě důležitější."`;
        },
        image: "",
        choices: [
            { text: "Poděkovat za rady", nextScene: "fablab" },
            { text: "Zeptat se na 3D tiskárny", nextScene: "explore3DPrinters" }
        ]
    },
    
    endDemo: {
        text: function() {
            const bossNames = {
                "Lea": "ředitelky Ley Klea",
                "Jiri": "profesora Jiřího Prímy",
                "Vaclav": "profesora Václava Polštáře",
                "Ondrej": "profesora Ondřeje Komínka"
            };
            
            const bossName = bossNames[gameState.flags.selectedBoss] || "profesora";
            
            return `Děkujeme za hru! ${gameState.playerName}, tvoje dobrodružství na průmyslové škole zde končí. Čelil/a jsi mnoha výzvám, učinil/a důležitá rozhodnutí a naučil/a se mnoho o škole i o sobě. Ať už tvá cesta vedla kamkoliv, jedno je jisté - zkušenost s ${bossName} tě navždy změnila.`;
        },
        image: "images/game_end.jpg",
        choices: [
            { text: "Hrát znovu", nextScene: "intro", action: () => {
                window.location.href = 'index.html';
            }}
        ]
    },
    
    // Add new scenes for final exam
    prepareForFinalExam: {
        text: function() {
            return `Stojíš před dveřmi místnosti, kde se koná finální zkouška. Na dveřích je cedule s nápisem "Finální zkouška - vyrušování = okamžitá diskvalifikace". Cítíš, jak ti srdce buší. Je čas zjistit, jak dobře jsi připraven/a na tuto velkou výzvu.`;
        },
        image: "images/exam_door.jpg",
        choices: [
            { text: "Vstoupit do zkušební místnosti", nextScene: "examStart" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
   
    
    // Nové scény pro projekty
    professorOffice: {
        text: function() {
            return `Vstupuješ do kanceláře profesora. Za stolem sedí ${getBossFullName()} a přísně si tě měří pohledem. "Á, nový student. Jsem rád, že jsi přišel. Jako každý student na naší škole musíš splnit semestrální projekt, abys mohl postoupit k závěrečné zkoušce."`;
        },
        image: function() {
            // Použijeme obrázek kanceláře
            return "images/professor_office.jpg";
        },
        render: function() {
            // Speciální renderování pro kancelář profesora s obrázkem vybraného profesora
            const sceneText = document.getElementById('sceneText');
            const choicesContainer = document.getElementById('choicesContainer');
            
            // Vyčistit kontejnery
            sceneText.innerHTML = `<p>${this.text()}</p>`;
            choicesContainer.innerHTML = '';
            
            // Nastavení obrázku kanceláře
            const sceneImage = document.getElementById('sceneImage');
            sceneImage.style.backgroundImage = `url('${this.image()}')`;
            
            // Zobrazení profesora
            if (gameState.flags.selectedBoss) {
                const professor = professors[gameState.flags.selectedBoss];
                const professorDisplay = document.createElement('div');
                professorDisplay.className = 'professor-display';
                
                professorDisplay.innerHTML = `
                    <img src="${professor.image}" alt="${professor.fullName}" class="professor-display-image">
                    <div class="professor-display-info">
                        <div class="professor-display-name">${professor.fullName}</div>
                        <div class="professor-display-role">${professor.role}</div>
                    </div>
                `;
                
                sceneText.appendChild(professorDisplay);
            }
            
            // Zobrazení možností projektů
            const choices = this.choices();
            
            choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                
                button.addEventListener('click', () => {
                    if (choice.action) {
                        choice.action();
                    }
                    
                    const nextScene = typeof choice.nextScene === 'function' 
                        ? choice.nextScene() 
                        : choice.nextScene;
                    
                    if (nextScene) {
                        loadScene(nextScene);
                    }
                });
                
                choicesContainer.appendChild(button);
            });
        },
        choices: function() {
            const professor = gameState.flags.selectedBoss;
            let choices = [];
            
            if (professor === "Ondrej") {
                choices = [
                    { text: "PHP projekt - backend aplikace", nextScene: "assignPHPProject", action: () => {
                        gameState.projects.semesterProject.assigned = true;
                        gameState.projects.semesterProject.type = "php";
                        gameState.projects.semesterProject.remainingTime = 10;
                        gameState.projects.semesterProject.professor = "Ondrej";
                    }}
                ];
            } else if (professor === "Jiri") {
                choices = [
                    { text: "Síťový projekt - návrh síťové infrastruktury", nextScene: "assignNetworkingProject", action: () => {
                        gameState.projects.semesterProject.assigned = true;
                        gameState.projects.semesterProject.type = "networking";
                        gameState.projects.semesterProject.remainingTime = 10;
                        gameState.projects.semesterProject.professor = "Jiri";
                    }},
                    { text: "3D tiskový projekt - návrh a tisk modelu", nextScene: "assign3DPrintingProject", action: () => {
                        gameState.projects.semesterProject.assigned = true;
                        gameState.projects.semesterProject.type = "3dprinting";
                        gameState.projects.semesterProject.remainingTime = 10;
                        gameState.projects.semesterProject.professor = "Jiri";
                    }}
                ];
            } else if (professor === "Lea") {
                choices = [
                    { text: "Matematický projekt - řešení komplexních rovnic", nextScene: "assignMathProject", action: () => {
                        gameState.projects.semesterProject.assigned = true;
                        gameState.projects.semesterProject.type = "math";
                        gameState.projects.semesterProject.remainingTime = 10;
                        gameState.projects.semesterProject.professor = "Lea";
                    }}
                ];
            } else if (professor === "Vaclav") {
                choices = [
                    { text: "PHP projekt - webová aplikace", nextScene: "assignPHPProject", action: () => {
                        gameState.projects.semesterProject.assigned = true;
                        gameState.projects.semesterProject.type = "php";
                        gameState.projects.semesterProject.remainingTime = 10;
                        gameState.projects.semesterProject.professor = "Vaclav";
                    }},
                    { text: "React projekt - frontend aplikace", nextScene: "assignReactProject", action: () => {
                        gameState.projects.semesterProject.assigned = true;
                        gameState.projects.semesterProject.type = "react";
                        gameState.projects.semesterProject.remainingTime = 10;
                        gameState.projects.semesterProject.professor = "Vaclav";
                    }}
                ];
            } else if (professor === "JJ") {
                choices = [
                    { text: "Projekt operačních systémů - analýza a optimalizace kernelu", nextScene: "assignOSProject", action: () => {
                        gameState.projects.semesterProject.assigned = true;
                        gameState.projects.semesterProject.type = "os";
                        gameState.projects.semesterProject.remainingTime = 10;
                        gameState.projects.semesterProject.professor = "JJ";
                    }}
                ];
            }
            
            choices.push({ text: "Odejít bez projektu (vrátit se později)", nextScene: "mainHall" });
            return choices;
        }
    },
    
    assignPHPProject: {
        text: function() {
            const professor = gameState.projects.semesterProject.professor;
            const professorNames = {
                "Ondrej": "profesor Komínek",
                "Vaclav": "profesor Polštář"
            };
            const professorName = professorNames[professor] || "profesor";
            
            return `"Výborná volba," říká ${professorName}. "Tvým úkolem bude vytvořit backend aplikaci v PHP. Budeš muset využít objektově orientované programování, práci s databází a API. Máš na to 10 dní, po kterých očekávám hotový projekt. Nezapomeň, že pozdní odevzdání bude mít následky na tvé hodnocení a zdraví." Profesor ti předává zadání projektu, které si ukládáš do batohu.`;
        },
        image: "images/php_project_assignment.jpg",
        choices: [
            { text: "Poděkovat a odejít", nextScene: "mainHall", action: () => {
                addToInventory("Zadání PHP projektu");
            }}
        ]
    },
    
    assignNetworkingProject: {
        text: function() {
            return `"Síťařina, zajímavé," poznamenává profesor Príma. "Tvým úkolem bude navrhnout síťovou infrastrukturu pro malou firmu. Budeš potřebovat znalosti o směrování, přepínačích a síťových protokolech. Hledám zde zejména porozumění VLAN, routování a bezpečnostním protokolům. Máš na to 10 dní. Pokud nestihneš termín, nezískáš potřebné kredity a tvé zdraví to pocítí." Profesor ti předává specifikace projektu, které si pečlivě ukládáš.`;
        },
        image: "images/network_project_assignment.jpg",
        choices: [
            { text: "Poděkovat a odejít", nextScene: "mainHall", action: () => {
                addToInventory("Zadání síťového projektu");
            }}
        ]
    },
    
    assign3DPrintingProject: {
        text: function() {
            return `"3D tisk, to je perspektivní oblast," přikyvuje profesor Príma. "Tvým úkolem bude navrhnout a vytisknout funkční model automatizovaného systému. Budeš muset zvládnout CAD software, nastavení 3D tiskárny a také základy elektroniky. Nezapomeň, že máš na to pouze 10 dní. Pozdní odevzdání by znamenalo výrazné snížení tvých životních sil." Profesor ti předává technické specifikace modelu, které si uložíš.`;
        },
        image: "images/3d_project_assignment.jpg",
        choices: [
            { text: "Poděkovat a odejít", nextScene: "mainHall", action: () => {
                addToInventory("Zadání 3D tiskového projektu");
            }}
        ]
    },
    
    assignMathProject: {
        text: function() {
            return `"Matematika je základ všech věd," říká ředitelka Klea s vážným výrazem. "Tvým úkolem bude vyřešit sadu komplexních matematických problémů zahrnujících diferenciální rovnice, lineární algebru a statistiku. Očekávám nejen správné výsledky, ale i detailní postup řešení s matematickým zdůvodněním. Máš na to 10 dní a věř mi, že pozdní odevzdání bude mít vážné následky na tvé studium i zdraví." Ředitelka ti předá složku s matematickými úlohami, kterou si pečlivě uložíš.`;
        },
        image: "images/math_project_assignment.jpg",
        choices: [
            { text: "Poděkovat a odejít", nextScene: "mainHall", action: () => {
                addToInventory("Zadání matematického projektu");
            }}
        ]
    },
    
    assignReactProject: {
        text: function() {
            return `"Frontend development je dnes klíčovou dovedností," vysvětluje profesor Polštář. "Tvým úkolem bude vytvořit interaktivní aplikaci v Reactu s využitím moderních přístupů. Budeš pracovat s Hooks, Context API a dalšími pokročilými koncepty. Chci vidět čistý kód, optimalizaci a responzivní design. Máš na to 10 dní a pamatuj, že pozdní odevzdání ovlivní tvé hodnocení i zdraví." Profesor ti předá specifikaci projektu, kterou si uložíš do batohu.`;
        },
        image: "images/react_project_assignment.jpg",
        choices: [
            { text: "Poděkovat a odejít", nextScene: "mainHall", action: () => {
                addToInventory("Zadání React projektu");
            }}
        ]
    },
    
    workOnPHPProject: {
        text: function() {
            return `Usedáš k počítači v učebně a začínáš pracovat na svém PHP projektu. Hodiny ubíhají, zatímco se snažíš implementovat backend funkcionalitu, propojit aplikaci s databází a vytvořit API endpointy. Ladíš kód, testuješ funkčnost, optimalizuješ dotazy... Je to náročné, ale cítíš, že se postupně blížíš k cíli.`;
        },
        image: "images/php_coding.jpg",
        action: () => {
            updateHealth(-10); // Práce na projektu je vysilující
        },
        choices: [
            { text: "Pokračovat v práci (postoupit s projektem)", nextScene: "continueProjectWork", action: () => {
                addToInventory("Rozpracovaný PHP projekt");
                updateHealth(-5);
            }},
            { text: "Udělat si přestávku", nextScene: "mainHall" }
        ]
    },
    
    workOnMathProject: {
        text: function() {
            return `Usazuješ se v tiché učebně a otevíráš složku s matematickými úlohami. Začínáš počítat diferenciální rovnice, řešit problémy lineární algebry a pracovat se statistickými modely. Čas ubíhá, zatímco pročítáš učebnice, hledáš správné postupy a snažíš se každý krok pečlivě zdůvodnit. Matematické úlohy jsou náročné a vyžadují plné soustředění.`;
        },
        image: "images/math_equations.jpg",
        action: () => {
            updateHealth(-15); // Matematika je extra vysilující
        },
        choices: [
            { text: "Pokračovat v práci (postoupit s projektem)", nextScene: "continueProjectWork", action: () => {
                addToInventory("Rozpracované matematické řešení");
                updateHealth(-10);
            }},
            { text: "Udělat si přestávku", nextScene: "mainHall" }
        ]
    },
    
    workOnReactProject: {
        text: function() {
            return `S notebookem v ruce se usazuješ v učebně a začínáš pracovat na React projektu. Připravuješ strukturu komponent, nastavuješ state management, pracuješ s Hooks a Context API. Hodiny ubíhají, zatímco testuješ různé přístupy, ladíš uživatelské rozhraní a snažíš se zajistit optimální výkon aplikace. Frontend development je kreativní, ale vyžaduje přesnost a znalost mnoha konceptů.`;
        },
        image: "images/react_coding.webp",
        action: () => {
            updateHealth(-10);
        },
        choices: [
            { text: "Pokračovat v práci (postoupit s projektem)", nextScene: "continueProjectWork", action: () => {
                addToInventory("Rozpracovaný React projekt");
                updateHealth(-5);
            }},
            { text: "Udělat si přestávku", nextScene: "mainHall" }
        ]
    },
    
    workOnNetworkingProject: {
        text: function() {
            return `V počítačové učebně se usazuješ a otevíráš síťový simulátor. Začínáš navrhovat síťovou topologii podle zadání. Konfiguruješ virtuální směrovače, přepínače a testuješ konektivitu. Práce je náročná a vyžaduje soustředění, ale postupně se ti daří vytvářet funkční síťový design.`;
        },
        image: "images/network_diagram.jpg",
        action: () => {
            updateHealth(-10);
        },
        choices: [
            { text: "Pokračovat v práci (postoupit s projektem)", nextScene: "continueProjectWork", action: () => {
                addToInventory("Rozpracovaný síťový projekt");
                updateHealth(-5);
            }},
            { text: "Udělat si přestávku", nextScene: "mainHall" }
        ]
    },
    
    workOn3DPrintingProject: {
        text: function() {
            return `Ve FABLABu si sedáš k počítači s CAD softwarem a začínáš navrhovat svůj 3D model. Snažíš se přesně dodržet zadané specifikace, měříš rozměry, vytváříš detaily. Práce s CAD programem je náročná, ale postupně se ti daří vytvářet model, který bude možné vytisknout na 3D tiskárně.`;
        },
        image: "images/cad_modeling.jpg",
        action: () => {
            updateHealth(-10);
        },
        choices: [
            { text: "Pokračovat v práci (postoupit s projektem)", nextScene: "continueProjectWork", action: () => {
                addToInventory("Rozpracovaný 3D model");
                updateHealth(-5);
            }},
            { text: "Udělat si přestávku", nextScene: "mainHall" }
        ]
    },
    
    continueProjectWork: {
        text: function() {
            const projectTypes = {
                "php": "PHP projektu",
                "networking": "síťovém projektu",
                "3dprinting": "3D modelu",
                "math": "matematickém projektu",
                "react": "React projektu"
            };
            
            const type = gameState.projects.semesterProject.type;
            
            return `Pokračuješ v práci na svém ${projectTypes[type]}. Po několika hodinách intenzivní práce cítíš, že jsi udělal/a významný pokrok. Projekt stále není dokončený, ale máš rozpracovanou verzi, kterou bys mohl/a ukázat profesorovi.`;
        },
        image: "images/project_progress.jpg",
        choices: [
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    submitProject: {
        text: function() {
            // Zjistíme, jaký typ projektu odevzdáváme
            const projectType = gameState.projects.semesterProject.type;
            const professor = gameState.projects.semesterProject.professor;
            let projectItem;
            
            const professorNames = {
                "Ondrej": "profesor Komínek",
                "Jiri": "profesor Príma",
                "Vaclav": "profesor Polštář",
                "Lea": "ředitelka Klea",
                "JJ": "profesor JJ"
            };
            
            const professorName = professorNames[professor] || "profesor";
            
            if (projectType === "php") {
                projectItem = "Rozpracovaný PHP projekt";
            } else if (projectType === "networking") {
                projectItem = "Rozpracovaný síťový projekt";
            } else if (projectType === "3dprinting") {
                projectItem = "Rozpracovaný 3D model";
            } else if (projectType === "math") {
                projectItem = "Rozpracované matematické řešení";
            } else if (projectType === "react") {
                projectItem = "Rozpracovaný React projekt";
            } else if (projectType === "os") {
                projectItem = "Rozpracovaný projekt operačních systémů";
            }
            
            // Ověříme, zda je projekt včas nebo pozdě
            if (gameState.projects.semesterProject.remainingTime <= 0) {
                updateHealth(-30);
                return `Předáváš svůj projekt ${professorName} s velkým zpožděním. ${professorName} si prohlíží tvou práci s výrazem zklamání. "Je vidět, že jsi na tom pracoval/a, ale termín je termín," říká přísně. "Tvé pozdní odevzdání bude mít vliv na tvé celkové hodnocení a zdraví." Cítíš, jak tě zaplavuje vlna vyčerpání a stresu, když si uvědomuješ následky svého zpoždění.`;
            } else {
                // Přidáme odměnu za včasné odevzdání
                const moneyReward = 300 + Math.floor(Math.random() * 200); // 300-500 Kč
                updateMoney(moneyReward);
                updateHealth(20);
                
                // Přidání znalostí do gameState pro tutoring bonusy
                gameState.completedProjectTypes = gameState.completedProjectTypes || [];
                if (!gameState.completedProjectTypes.includes(projectType)) {
                    gameState.completedProjectTypes.push(projectType);
                }
                
                return `Předáváš svůj dokončený projekt ${professorName} včas. ${professorName} si prohlíží tvou práci a pokyvuje hlavou. "Dobrá práce, ${gameState.playerName}. Vidím, že jsi tomu věnoval/a potřebný čas a úsilí. Tvůj projekt splňuje všechny požadavky." 

${professorName} ti dává odměnu ${moneyReward} Kč za kvalitní práci. Cítíš vlnu úlevy a hrdosti na to, co jsi dokázal/a.`;
            }
        },
        image: "images/project_submission.jpg",
        action: () => {
            gameState.projects.semesterProject.completed = true;
            
            // Odstranění projektu z inventáře
            const projectType = gameState.projects.semesterProject.type;
            
            if (projectType === "php") {
                removeFromInventory("Rozpracovaný PHP projekt");
                removeFromInventory("Zadání PHP projektu");
            } else if (projectType === "networking") {
                removeFromInventory("Rozpracovaný síťový projekt");
                removeFromInventory("Zadání síťového projektu");
            } else if (projectType === "3dprinting") {
                removeFromInventory("Rozpracovaný 3D model");
                removeFromInventory("Zadání 3D tiskového projektu");
            } else if (projectType === "math") {
                removeFromInventory("Rozpracované matematické řešení");
                removeFromInventory("Zadání matematického projektu");
            } else if (projectType === "react") {
                removeFromInventory("Rozpracovaný React projekt");
                removeFromInventory("Zadání React projektu");
            } else if (projectType === "os") {
                removeFromInventory("Rozpracovaný projekt operačních systémů");
                removeFromInventory("Zadání projektu operačních systémů");
            }
        },
        choices: [
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    // Nová scéna s otázkami pro finální zkoušku
    examQuestions: {
        text: function() {
            return `${getBossFullName()} ti předává test a vážným hlasem říká: "Tato zkouška prověří tvé znalosti z našeho oboru. Odpověz správně na následující otázky, a prokážeš, že jsi hoden/hodna absolvovat naši školu."

První otázka se týká programování. Profesor pokračuje: "Co je to C#?"`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "Programovací jazyk vyvinutý společností Microsoft", nextScene: "examQuestion2", action: () => {
                gameState.examScore = 1;
            }},
            { text: "Databázový dotazovací jazyk", nextScene: "examQuestion2", action: () => {
                gameState.examScore = 0;
            }},
            { text: "Značkovací jazyk pro tvorbu webových stránek", nextScene: "examQuestion2", action: () => {
                gameState.examScore = 0;
            }},
            { text: "Grafický editor od Adobe", nextScene: "examQuestion2", action: () => {
                gameState.examScore = 0;
            }}
        ]
    },
    
    examQuestion2: {
        text: function() {
            return `"Dobrá," pokračuje profesor. "Další otázka: Co je to Singleton?"`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "Návrhový vzor zajišťující existenci pouze jedné instance třídy", nextScene: "examQuestion3", action: () => {
                gameState.examScore += 1;
            }},
            { text: "Typ proměnné, která může nabývat pouze jedné hodnoty", nextScene: "examQuestion3", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "Programovací jazyk pro vývoj mobilních aplikací", nextScene: "examQuestion3", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "Metoda pro testování webových aplikací", nextScene: "examQuestion3", action: () => {
                // Skóre se nemění při špatné odpovědi
            }}
        ]
    },
    
    examQuestion3: {
        text: function() {
            return `Profesor pokyvuje hlavou a zadává další otázku: "Co je to DHCP?"`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "Protokol pro automatické přiřazování IP adres", nextScene: "examQuestion4", action: () => {
                gameState.examScore += 1;
            }},
            { text: "Databázový systém pro velké objemy dat", nextScene: "examQuestion4", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "Metoda šifrování dat v počítačových sítích", nextScene: "examQuestion4", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "Standard pro bezdrátové připojení", nextScene: "examQuestion4", action: () => {
                // Skóre se nemění při špatné odpovědi
            }}
        ]
    },
    
    examQuestion4: {
        text: function() {
            return `"Nyní se dostáváme k webovému vývoji," pokračuje profesor. "Co je to PHP?"`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "Skriptovací jazyk pro vývoj webových aplikací", nextScene: "examQuestion5", action: () => {
                gameState.examScore += 1;
            }},
            { text: "Značkovací jazyk pro definici struktury webových stránek", nextScene: "examQuestion5", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "Programovací jazyk pro vývoj desktopových aplikací", nextScene: "examQuestion5", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "Framework pro vývoj mobilních aplikací", nextScene: "examQuestion5", action: () => {
                // Skóre se nemění při špatné odpovědi
            }}
        ]
    },
    
    examQuestion5: {
        text: function() {
            return `"Poslední otázka," říká profesor s přísným pohledem. "Jak definujeme proměnnou v PHP?"`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "$promenna = hodnota;", nextScene: "evaluateExam", action: () => {
                gameState.examScore += 1;
            }},
            { text: "var promenna = hodnota;", nextScene: "evaluateExam", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "let promenna = hodnota;", nextScene: "evaluateExam", action: () => {
                // Skóre se nemění při špatné odpovědi
            }},
            { text: "dim promenna as hodnota", nextScene: "evaluateExam", action: () => {
                // Skóre se nemění při špatné odpovědi
            }}
        ]
    },
    
    evaluateExam: {
        text: function() {
            return `Profesor sbírá tvé odpovědi a pečlivě je kontroluje. Po chvíli vzhlédne a...`;
        },
        image: "images/exam_grading.jpg",
        choices: [
            { text: "Očekávat výsledky", nextScene: function() {
                // Kontrola připravenosti (má všechny potřebné předměty)
                const isPrepared = gameState.inventory.includes("Tiger energeťák") &&
                    gameState.inventory.includes("Poznámky ze sítí") &&
                    gameState.inventory.includes("Poznámky z programování");
                
                // Pokud je připraven nebo získal alespoň 4 body v testu, uspěje
                if (isPrepared || gameState.examScore >= 4) {
                    return "finalExamSuccess";
                } else {
                    return "finalExamFailure";
                }
            }}
        ]
    },
    
    assignOSProject: {
        text: function() {
            return `"Dobrá volba," říká JJ s úsměvem a provádí rychlý karate pohyb rukama. "Tvým úkolem bude analyzovat a optimalizovat linuxový kernel pro specifické použití. Budeš muset pochopit jeho architekturu, identifikovat úzká místa a navrhnout řešení pro zlepšení výkonu. Máš na to 10 dní - a věř mi, že termín je stejně neúprosný jako dobrý úder karate." JJ ti předává specifikace projektu, které si pečlivě ukládáš.`;
        },
        image: "images/os_project_assignment.jpg",
        choices: [
            { text: "Poděkovat a odejít", nextScene: "mainHall", action: () => {
                addToInventory("Zadání projektu operačních systémů");
            }}
        ]
    },
    
    workOnOSProject: {
        text: function() {
            return `Usedáš k počítači a začínáš analyzovat linuxový kernel. Zkoumáš zdrojový kód, hledáš možnosti optimalizace a testuješ různá nastavení. Je to náročná práce, která vyžaduje hluboké porozumění architektuře operačních systémů. Po několika hodinách cítíš, jak se ti postupně rozjasňuje v hlavě a začínáš chápat složité koncepty.`;
        },
        image: "images/coding_kernel.jpg",
        action: () => {
            updateHealth(-12);
        },
        choices: [
            { text: "Pokračovat v práci (postoupit s projektem)", nextScene: "continueProjectWork", action: () => {
                addToInventory("Rozpracovaný projekt operačních systémů");
                updateHealth(-6);
            }},
            { text: "Udělat si přestávku", nextScene: "mainHall" }
        ]
    },
    
    partTimeJob: {
        text: function() {
            // Display completed project expertise
            let expertise = "";
            if (gameState.completedProjectTypes && gameState.completedProjectTypes.length > 0) {
                expertise = "\n\nDíky tvým dokončeným projektům máš znalosti v těchto oblastech:";
                
                const expertiseAreas = {
                    "php": "PHP programování",
                    "networking": "Síťové technologie",
                    "3dprinting": "3D modelování a tisk",
                    "math": "Matematika a řešení rovnic",
                    "react": "Frontend vývoj s Reactem",
                    "os": "Operační systémy"
                };
                
                gameState.completedProjectTypes.forEach(type => {
                    if (expertiseAreas[type]) {
                        expertise += `\n- ${expertiseAreas[type]}`;
                    }
                });
                
                expertise += "\n\nTyto znalosti ti mohou přinést vyšší odměny za doučování a IT výpomoc!";
            }
            
            return `Ve vestibulu školy najdeš nástěnku s nabídkami brigád a přivýdělků. Některé vyžadují specifické znalosti, jiné jsou jednodušší, ale méně placené. Máš několik možností, jak si vydělat:

1. Výpomoc v IT učebně (150 Kč/hodinu) - nastavování počítačů a pomoc studentům
2. Úklid tříd po vyučování (100 Kč/hodinu) - jednoduchá práce, ale méně placená
3. Doučování mladších studentů (200 Kč/hodinu) - vyžaduje dobré znalosti
4. Roznos letáků ve městě (80 Kč/hodinu) - nudná, ale nenáročná práce${expertise}`;
        },
        image: "images/job_board.jpg",
        choices: function() {
            // Check for expertise bonuses
            const hasITExpertise = gameState.completedProjectTypes && (
                gameState.completedProjectTypes.includes("php") || 
                gameState.completedProjectTypes.includes("networking") ||
                gameState.completedProjectTypes.includes("os")
            );
            
            const hasTutoringExpertise = gameState.completedProjectTypes && (
                gameState.completedProjectTypes.includes("math") || 
                gameState.completedProjectTypes.includes("react") ||
                gameState.completedProjectTypes.includes("php")
            );
            
            // Base earnings
            const itBaseEarnings = 150;
            const tutoringBaseEarnings = 200;
            
            // Bonuses for expertise
            const itBonus = hasITExpertise ? 100 : 0;
            const tutoringBonus = hasTutoringExpertise ? 150 : 0;
            
            // Final earnings
            const itEarnings = itBaseEarnings + itBonus;
            const tutoringEarnings = tutoringBaseEarnings + tutoringBonus;
            
            // Generate job choices with appropriate bonuses
            let choices = [
                { text: `Výpomoc v IT učebně (získáš ${itEarnings} Kč${hasITExpertise ? ' včetně bonusu za zkušenosti' : ''}, - 15 zdraví)`, 
                  nextScene: "jobDone", 
                  action: () => {
                    updateMoney(itEarnings);
                    updateHealth(-15);
                    updateProjectTime();
                  }
                },
                { text: "Úklid tříd (získáš 100 Kč, - 10 zdraví)", 
                  nextScene: "jobDone", 
                  action: () => {
                    updateMoney(100);
                    updateHealth(-10);
                    updateProjectTime();
                  }
                },
                { text: `Doučování (získáš ${tutoringEarnings} Kč${hasTutoringExpertise ? ' včetně bonusu za zkušenosti' : ''}, - 20 zdraví)`, 
                  nextScene: "jobDone", 
                  action: () => {
                    updateMoney(tutoringEarnings);
                    updateHealth(-20);
                    updateProjectTime();
                  }
                },
                { text: "Roznos letáků (získáš 80 Kč, - 5 zdraví)", 
                  nextScene: "jobDone", 
                  action: () => {
                    updateMoney(80);
                    updateHealth(-5);
                    updateProjectTime();
                  }
                },
                { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
            ];
            
            return choices;
        }
    },
    
    jobDone: {
        text: function() {
            return `Dokončil/a jsi svou brigádu a vydělal/a si peníze. Cítíš se trochu unaveně, ale váček s penězi je o něco těžší. Momentálně máš ${gameState.money} Kč.`;
        },
        image: "images/earned_money.jpg",
        choices: [
            { text: "Vzít si další brigádu", nextScene: "partTimeJob" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    gambling: {
        text: function() {
            return `Ve škole jsou různé možnosti hazardního hraní. S trochou štěstí můžeš rychle získat peníze... nebo o ně přijít.

Aktuálně máš ${gameState.money} Kč. Vyber si způsob, kterým chceš zkusit své štěstí:`;
        },
        image: "images/gambling.jpg",
        choices: [
            { text: "Karty se spolužáky (klasický hazard)", nextScene: "cardGambling" },
            { text: "Hrací automaty (vyšší riziko, vyšší odměna)", nextScene: "slotMachines" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    cardGambling: {
        text: function() {
            return `V zapadlém rohu školy najdeš skupinku studentů hrajících karetní hru o peníze. Zdá se riskantní, ale mohla by to být rychlá cesta k penězům... nebo k jejich ztrátě.

Minimální sázka je 50 Kč. Aktuálně máš ${gameState.money} Kč.`;
        },
        image: "images/card_game.jpg",
        choices: function() {
            const choices = [];
            
            if (gameState.money >= 50) {
                choices.push({ text: "Vsadit 50 Kč (šance na výhru/prohru)", nextScene: "cardGamblingResult", action: () => {
                    gameState.betAmount = 50;
                    gameState.gamblingType = "cards";
                }});
            }
            
            if (gameState.money >= 100) {
                choices.push({ text: "Vsadit 100 Kč (šance na výhru/prohru)", nextScene: "cardGamblingResult", action: () => {
                    gameState.betAmount = 100;
                    gameState.gamblingType = "cards";
                }});
            }
            
            if (gameState.money >= 200) {
                choices.push({ text: "Vsadit 200 Kč (šance na výhru/prohru)", nextScene: "cardGamblingResult", action: () => {
                    gameState.betAmount = 200;
                    gameState.gamblingType = "cards";
                }});
            }
            
            choices.push({ text: "Zpět na výběr hazardu", nextScene: "gambling" });
            choices.push({ text: "Vrátit se do hlavní haly", nextScene: "mainHall" });
            
            return choices;
        }
    },
    
    cardGamblingResult: {
        text: function() {
            // 40% šance na výhru
            const win = Math.random() < 0.4;
            const betAmount = gameState.betAmount;
            
            if (win) {
                updateMoney(betAmount * 2);
                // Check if died from health impact
                const died = updateHealth(-5); // Minor stress from gambling even when winning
                // If died, return empty text - game over scene handles it
                if (died) return "";
                
                return `Štěstí ti přeje! Vyhráváš dvojnásobek své sázky: ${betAmount * 2} Kč! Tvůj současný zůstatek je ${gameState.money} Kč.`;
            } else {
                updateMoney(-betAmount);
                // Check if died from health impact
                const died = updateHealth(-15); // Significant stress from losing money
                // If died, return empty text - game over scene handles it
                if (died) return "";
                
                return `Bohužel, štěstí ti dnes nepřeje. Ztrácíš svou sázku ${betAmount} Kč. Tvůj současný zůstatek je ${gameState.money} Kč. Cítíš, jak tě zaplavuje stres ze ztráty peněz.`;
            }
        },
        image: "images/gambling_result.jpg",
        choices: [
            { text: "Vsadit znovu", nextScene: "cardGambling" },
            { text: "Zkusit automaty", nextScene: "slotMachines" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    slotMachines: {
        text: function() {
            return `V suterénu školy narazíš na místnost s hracími automaty. Jejich blikající světla a zvukové efekty tě hypnotizují. Tyto automaty nabízejí vyšší možnou výhru, ale šance na výhru je menší a sázky jsou dražší.

Minimální sázka je 100 Kč. Aktuálně máš ${gameState.money} Kč.`;
        },
        image: "images/slot_machines.jpg",
        render: function() {
            // Aktualizovat text scény
            const sceneText = `V suterénu školy narazíš na místnost s hracími automaty. Jejich blikající světla a zvukové efekty tě hypnotizují. Tyto automaty nabízejí vyšší možnou výhru, ale šance na výhru je menší a sázky jsou dražší.

Minimální sázka je 100 Kč. Aktuálně máš ${gameState.money} Kč.`;
            sceneTextElement.innerHTML = `<p>${sceneText}</p>

<div class="slot-machine-container">
    <div class="slot-machine-display">
        <div class="slot-reel">
            <div class="slot-symbol">
                <svg viewBox="0 0 100 100" class="seven-symbol spinning">
                    <text x="25" y="70" font-size="70" font-weight="bold">7</text>
                </svg>
            </div>
        </div>
        <div class="slot-reel">
            <div class="slot-symbol">
                <svg viewBox="0 0 100 100" class="diamond-symbol spinning">
                    <polygon points="50,10 90,50 50,90 10,50" />
                </svg>
            </div>
        </div>
        <div class="slot-reel">
            <div class="slot-symbol">
                <svg viewBox="0 0 100 100" class="cherry-symbol spinning">
                    <circle cx="30" cy="65" r="25"/>
                    <circle cx="70" cy="65" r="25"/>
                    <path d="M 30 35 Q 50 10 70 35" stroke-width="8" stroke="#5D4037" fill="none"/>
                </svg>
            </div>
        </div>
        <div class="slot-lever"></div>
    </div>
</div>`;
            
            // Nastavit obrázek scény
            sceneImageElement.style.backgroundImage = `url('images/slot_machines.jpg')`;
            
            // Vyčistit kontejner s volbami
            choicesContainer.innerHTML = '';
            
            // Získat volby (ošetření jak pole, tak funkce)
            let choices = [];
            
            if (gameState.money >= 100) {
                choices.push({ text: "Vsadit 100 Kč (vyšší risk, vyšší odměna)", nextScene: "slotMachinesResult", action: () => {
                    gameState.betAmount = 100;
                    gameState.gamblingType = "slots";
                    animateSlotMachine();
                }});
            }
            
            if (gameState.money >= 200) {
                choices.push({ text: "Vsadit 200 Kč (vyšší risk, vyšší odměna)", nextScene: "slotMachinesResult", action: () => {
                    gameState.betAmount = 200;
                    gameState.gamblingType = "slots";
                    animateSlotMachine();
                }});
            }
            
            if (gameState.money >= 500) {
                choices.push({ text: "Vsadit 500 Kč (vysoký risk, nejvyšší odměna)", nextScene: "slotMachinesResult", action: () => {
                    gameState.betAmount = 500;
                    gameState.gamblingType = "slots";
                    animateSlotMachine();
                }});
            }
            
            choices.push({ text: "Zpět na výběr hazardu", nextScene: "gambling" });
            choices.push({ text: "Vrátit se do hlavní haly", nextScene: "mainHall" });
            
            // Přidat nové volby
            choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                
                button.addEventListener('click', () => {
                    // Provést akci volby, pokud existuje
                    if (choice.action) {
                        choice.action();
                    }
                    
                    // Zjistit další scénu - může být řetězec nebo funkce, která vrací řetězec
                    const nextScene = typeof choice.nextScene === 'function' 
                        ? choice.nextScene() 
                        : choice.nextScene;
                    
                    // Pokud je definována další scéna, načíst ji (nemusí být, pokud akce zpracovává navigaci)
                    if (nextScene) {
                        gameState.nextSceneAfterAnimation = nextScene;
                    }
                });
                
                choicesContainer.appendChild(button);
            });
        },
        choices: function() {
            // Tato funkce se ve skutečnosti nepoužije, protože používáme vlastní renderování,
            // ale musí existovat pro kompatibilitu
            const choices = [];
            return choices;
        }
    },
    
    slotMachinesResult: {
        text: function() {
            // Různé výsledky na automatu:
            // 20% šance na malou výhru (1.5x sázka)
            // 5% šance na velkou výhru (3x sázka)
            // 1% šance na jackpot (5x sázka)
            // 74% šance na prohru
            const roll = Math.random();
            const betAmount = gameState.betAmount;
            let winAmount = 0;
            let result = "";
            let healthImpact = 0;
            let resultClass = "";
            
            if (roll < 0.01) {
                // Jackpot
                winAmount = betAmount * 5;
                result = `JACKPOT!!! Automaty explodují světlem a zvuky! Vyhráváš pětinásobek své sázky: ${winAmount} Kč!`;
                healthImpact = -10; // Vzrušení z jackpotu také způsobuje stres
                resultClass = "jackpot-win";
                gameState.slotResult = "jackpot";
            } else if (roll < 0.06) {
                // Velká výhra
                winAmount = betAmount * 3;
                result = `Velká výhra! Na displeji se rozblikají světla a automat vydává hlasité zvuky. Vyhráváš trojnásobek své sázky: ${winAmount} Kč!`;
                healthImpact = -8;
                resultClass = "big-win";
                gameState.slotResult = "big-win";
            } else if (roll < 0.26) {
                // Malá výhra
                winAmount = Math.floor(betAmount * 1.5);
                result = `Menší výhra. Vyhráváš ${winAmount} Kč.`;
                healthImpact = -5;
                resultClass = "small-win";
                gameState.slotResult = "small-win";
            } else {
                // Prohra
                winAmount = -betAmount;
                result = `Automaty vyhrály... Ztrácíš svou sázku ${betAmount} Kč. Stroj se zdá být téměř výsměšný.`;
                healthImpact = -20; // Výrazný stres z prohry na automatech
                resultClass = "no-win";
                gameState.slotResult = "no-win";
            }
            
            // Uložit výsledek do herního stavu
            gameState.slotResultText = result;
            gameState.slotResultClass = resultClass;
            gameState.slotWinAmount = winAmount;
            gameState.slotHealthImpact = healthImpact;
            
            // Aktualizace peněz
            updateMoney(winAmount);
            
            // Aktualizace zdraví
            const died = updateHealth(healthImpact);
            if (died) return "";
            
            return `${result} Tvůj současný zůstatek je ${gameState.money} Kč.`;
        },
        image: "images/slot_result.jpg",
        render: function() {
            // Aktualizace zobrazení výsledku
            const resultText = gameState.slotResultText;
            const resultClass = gameState.slotResultClass;
            
            // Symboly pro různé výsledky
            let symbols = [];
            
            if (gameState.slotResult === "jackpot") {
                symbols = ['seven', 'seven', 'seven'];
            } else if (gameState.slotResult === "big-win") {
                symbols = ['seven', 'seven', 'diamond'];
            } else if (gameState.slotResult === "small-win") {
                symbols = ['diamond', 'bell', 'cherry'];
            } else {
                symbols = ['bar', 'cherry', 'diamond'];
            }
            
            // Vytvořit zobrazení výsledku
            sceneTextElement.innerHTML = `
                <div class="slot-machine-container">
                    <div class="slot-machine-display">
                        <div class="slot-reel">
                            <div class="slot-symbol">
                                <svg viewBox="0 0 100 100" class="${symbols[0]}-symbol win-flicker">
                                    ${getSymbolSVG(symbols[0])}
                                </svg>
                            </div>
                        </div>
                        <div class="slot-reel">
                            <div class="slot-symbol">
                                <svg viewBox="0 0 100 100" class="${symbols[1]}-symbol win-flicker">
                                    ${getSymbolSVG(symbols[1])}
                                </svg>
                            </div>
                        </div>
                        <div class="slot-reel">
                            <div class="slot-symbol">
                                <svg viewBox="0 0 100 100" class="${symbols[2]}-symbol win-flicker">
                                    ${getSymbolSVG(symbols[2])}
                                </svg>
                            </div>
                        </div>
                        <div class="slot-lever"></div>
                    </div>
                    <div class="slot-machine-result ${resultClass}">
                        ${resultText}
                    </div>
                </div>
            `;
            
            // Nastavit obrázek scény
            sceneImageElement.style.backgroundImage = `url('images/slot_result.jpg')`;
            
            // Vyčistit kontejner s volbami
            choicesContainer.innerHTML = '';
            
            // Přidat volby
            const choices = [
                { text: "Zkusit štěstí znovu", nextScene: "slotMachines" },
                { text: "Zkusit karty", nextScene: "cardGambling" },
                { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
            ];
            
            // Přidat nové volby
            choices.forEach(choice => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                
                button.addEventListener('click', () => {
                    const nextScene = choice.nextScene;
                    if (nextScene) {
                        loadScene(nextScene);
                    }
                });
                
                choicesContainer.appendChild(button);
            });
        },
        choices: [
            { text: "Zkusit štěstí znovu", nextScene: "slotMachines" },
            { text: "Zkusit karty", nextScene: "cardGambling" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    // Add new scene for computer repair opportunity
    computerRepair: {
        text: function() {
            return `Narazil/a jsi na nabídku opravy počítačů pro místní firmu. Je to lukrativní příležitost, ale vyžaduje skutečné technické znalosti a nese určité riziko. Pokud se ti povede, dostaneš dobře zaplaceno, ale pokud se něco pokazí, budeš muset zaplatit za škody.

Máš tři možnosti:
1. Jednoduchá údržba (výdělek 300-500 Kč, nízké riziko)
2. Instalace sítě (výdělek 500-800 Kč, střední riziko)
3. Oprava serverů (výdělek 1000-1500 Kč, vysoké riziko)`;
        },
        image: "images/computer_repair.jpg",
        choices: [
            { text: "Jednoduchá údržba počítačů", nextScene: "repairResult", action: () => {
                gameState.repairType = "simple";
                gameState.repairRisk = 0.1; // 10% šance na neúspěch
                gameState.repairReward = 300 + Math.floor(Math.random() * 200); // 300-500 Kč
                updateProjectTime();
            }},
            { text: "Instalace sítě", nextScene: "repairResult", action: () => {
                gameState.repairType = "network";
                gameState.repairRisk = 0.25; // 25% šance na neúspěch
                gameState.repairReward = 500 + Math.floor(Math.random() * 300); // 500-800 Kč
                updateProjectTime();
            }},
            { text: "Oprava serverů", nextScene: "repairResult", action: () => {
                gameState.repairType = "server";
                gameState.repairRisk = 0.4; // 40% šance na neúspěch
                gameState.repairReward = 1000 + Math.floor(Math.random() * 500); // 1000-1500 Kč
                updateProjectTime();
            }},
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    // Add result scene for computer repair
    repairResult: {
        text: function() {
            const repairTypes = {
                "simple": "jednoduchou údržbu počítačů",
                "network": "instalaci sítě",
                "server": "opravu serverů"
            };
            
            const failure = Math.random() < gameState.repairRisk;
            const reward = gameState.repairReward;
            const penalty = Math.floor(reward * 1.5); // Penále za neúspěch je 1.5x odměna
            
            if (failure) {
                updateMoney(-penalty);
                
                // Health impact scales with risk level - might trigger game over
                let died = false;
                if (gameState.repairType === "simple") {
                    died = updateHealth(-20); // Low risk but still significant
                } else if (gameState.repairType === "network") {
                    died = updateHealth(-30); // Medium risk
                } else if (gameState.repairType === "server") {
                    died = updateHealth(-45); // High risk - could be fatal
                }
                
                // If player died, don't return any text as the game over scene will handle it
                if (died) return "";
                
                return `Bohužel se ti nepodařilo dokončit ${repairTypes[gameState.repairType]} úspěšně. Něco jsi pokazil/a a firma požaduje náhradu škody ve výši ${penalty} Kč. Cítíš se vyčerpaně a zklamaně. Tvůj současný zůstatek je ${gameState.money} Kč.`;
            } else {
                updateMoney(reward);
                
                // Even successful repairs impact health
                let died = false;
                if (gameState.repairType === "simple") {
                    died = updateHealth(-10); // Minimal impact for simple repairs
                } else if (gameState.repairType === "network") {
                    died = updateHealth(-15); // Medium impact
                } else if (gameState.repairType === "server") {
                    died = updateHealth(-20); // High impact even when successful
                }
                
                // If player died, don't return any text
                if (died) return "";
                
                return `Úspěšně jsi dokončil/a ${repairTypes[gameState.repairType]}! Dostáváš odměnu ${reward} Kč. Tvůj současný zůstatek je ${gameState.money} Kč.`;
            }
        },
        image: "images/repair_result.jpg",
        choices: [
            { text: "Vzít další zakázku", nextScene: "computerRepair" },
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    },
    
    // Add game over scene
    gameOver: {
        text: function() {
            let deathReason = "";
            
            // Determine death reason based on current scene or activity
            if (gameState.currentScene === 'classroom' || gameState.currentScene.includes('Project')) {
                deathReason = "Studijní stres byl příliš velký. Nekonečné projekty a deadliny tě úplně vyčerpaly.";
            } else if (gameState.currentScene === 'bufet') {
                deathReason = "Nedostatek peněz na jídlo a únava z neustálého šetření tě dostaly.";
            } else if (gameState.currentScene === 'partTimeJob' || gameState.currentScene === 'jobDone') {
                deathReason = "Přepracování z brigád a nedostatek spánku si vybraly svou daň.";
            } else if (gameState.currentScene === 'gambling') {
                deathReason = "Gamblerství tě zničilo. Finanční stres a ztráta všech peněz byly příliš na tvou psychiku.";
            } else if (gameState.currentScene === 'computerRepair' || gameState.currentScene === 'repairResult') {
                deathReason = "Riziko se nevyplatilo. Stres z opravy počítačů a zodpovědnost byly příliš velké.";
            } else {
                deathReason = "Kombinace stresu, nedostatku spánku a nároků školy byla příliš mnoho.";
            }
            
            // Debug log
            console.log("Generating game over text, death reason:", deathReason);
            
            // Return HTML without indentation to avoid formatting issues
            return `<h2 style="color: #f44336; margin-bottom: 15px; text-align: center;">KONEC HRY</h2>
<p>Tvé zdraví kleslo na nulu! ${deathReason}</p>
<p>Tvoje dobrodružství na průmyslové škole zde končí. Bohužel jsi nezvládl/a dosáhnout svého cíle a udělat maturitu.</p>
<p style="margin-top: 20px; font-style: italic;">Statistiky:</p>
<ul style="margin-left: 20px; margin-top: 10px;">
<li>Získané peníze: ${gameState.money} Kč</li>
<li>Počet předmětů v inventáři: ${gameState.inventory.length}</li>
<li>Dokončené projekty: ${gameState.completedProjectTypes ? gameState.completedProjectTypes.length : 0}</li>
</ul>
<p style="margin-top: 20px; text-align: center; font-weight: bold;">Zkus to znovu a možná budeš mít větší štěstí!</p>`;
        },
        image: "images/game_over.jpg",
        choices: [
            { text: "Začít znovu", nextScene: "intro", action: () => {
                resetGame();
            }}
        ]
    },
    
    // Add test scene to trigger game over
    testDeath: {
        text: function() {
            return "Tato scéna slouží k testování konce hry. Po kliknutí na tlačítko bude tvé zdraví sníženo na 0.";
        },
        image: "images/danger.jpg",
        choices: [
            { text: "Snížit zdraví na 0", action: () => {
                console.log("Test: Setting health to 0");
                updateHealth(-gameState.health); // Reduce health to 0
            }},
            { text: "Vrátit se do hlavní haly", nextScene: "mainHall" }
        ]
    }
};

// Restore main hall choices to original
scenes.mainHall.choices = originalMainHallChoices;

// Helper function to get boss full name
function getBossFullName() {
    const bossNames = {
        "Lea": "Ředitelka Lea Klea",
        "Jiri": "Profesor Jiří Príma",
        "Vaclav": "Profesor Václav Polštář",
        "Ondrej": "Profesor Ondřej Komínek",
        "JJ": "Profesor JJ"
    };
    
    return gameState.flags.selectedBoss ? bossNames[gameState.flags.selectedBoss] : "Tvůj vybraný profesor";
}

// Function to reset the game
function resetGame() {
    // Reset game state
    gameState.health = 100;
    gameState.money = 200;
    gameState.inventory = [];
    gameState.currentScene = 'intro';
    gameState.playerName = '';
    gameState.flags = {
        metProfessor: false,
        hasKey: false,
        defeatedGuard: false,
        visitedLibrary: false,
        visitedCafeteria: false,
        selectedBoss: null,
        foundEnchantedPen: false,
        attendedClass: false,
        talkedToStudent: false,
        disclaimerAccepted: true // Keep true to avoid showing disclaimer again
    };
    gameState.projects = {
        semesterProject: {
            assigned: false,
            completed: false,
            dueDate: 10,
            remainingTime: 10,
            type: null,
            professor: null
        }
    };
    gameState.visitCounter = 0;
    gameState.completedProjectTypes = [];
    
    // Update UI displays
    updateHealthDisplay();
    updateMoneyDisplay();
    updateInventoryDisplay();
    
    // Reload the page to restart the game
    window.location.href = 'index.html';
}

// Function to load a scene
function loadScene(sceneName) {
    // Aktualizace předchozí scény pro navigaci zpět
    gameState.previousScene = gameState.currentScene;
    gameState.currentScene = sceneName;
    
    // Pokud scéna neexistuje, vrátit se do hlavní haly
    if (!scenes[sceneName]) {
        console.error(`Scéna '${sceneName}' neexistuje!`);
        sceneName = 'mainHall';
    }

    const scene = scenes[sceneName];
    
    // Speciální zpracování pro game over
    if (sceneName === 'gameOver') {
        showGameOverScreen();
        return;
    }
    
    // Získat text scény
    let sceneText = '';
    if (typeof scene.text === 'function') {
        sceneText = scene.text();
        
        // Pokud funkce text() vrátí prázdný řetězec, předpokládáme, že nastala smrt
        if (sceneText === '' && gameState.health <= 0) {
            showGameOverScreen();
            return;
        }
    } else {
        sceneText = scene.text;
    }
    
    // Kontrola, zda má scéna vlastní renderování
    if (scene.render && typeof scene.render === 'function') {
        // Použít vlastní renderování scény
        scene.render();
        return;
    }
    
    // Standardní renderování scény
    // Nastavit text scény
    sceneTextElement.innerHTML = `<p>${sceneText}</p>`;
    
    // Nastavit obrázek scény
    if (scene.image) {
        sceneImageElement.style.backgroundImage = `url('${scene.image}')`;
        sceneImageElement.style.display = 'block';
    } else {
        sceneImageElement.style.display = 'none';
    }
    
    // Vyčistit existující volby
    choicesContainer.innerHTML = '';
    
    // Získat volby (ošetření jak pole, tak funkce)
    let choices = [];
    if (typeof scene.choices === 'function') {
        choices = scene.choices();
    } else {
        choices = scene.choices;
    }
    
    // Přidat nové volby
            choices.forEach(choice => {
        // Zkontrolovat, zda má volba podmínku a zda je splněna
        if (choice.condition && !choice.condition()) {
            return; // Přeskočit tlačítko, pokud podmínka není splněna
        }
        
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.textContent = choice.text;
                
                button.addEventListener('click', () => {
            // Provést akci volby, pokud existuje
                    if (choice.action) {
                        choice.action();
                    }
                    
            // Zjistit další scénu - může být řetězec nebo funkce, která vrací řetězec
                    const nextScene = typeof choice.nextScene === 'function' 
                        ? choice.nextScene() 
                        : choice.nextScene;
                    
            // Pokud je definována další scéna, načíst ji (nemusí být, pokud akce zpracovává navigaci)
                    if (nextScene) {
                        loadScene(nextScene);
                    }
                });
                
                choicesContainer.appendChild(button);
            });
    
    // Aktualizovat zobrazení peněz a zdraví
    updateMoneyDisplay();
    updateHealthDisplay();
    
    // Pokud je scéna "startExam", spustí se maturitní zkouška
    if (sceneName === "startExam") {
        sceneName = "examStart";
    }
}

// Function to update health
function updateHealth(change) {
    // Přidat změnu zdraví
    gameState.health += change;
    
    // Zajistit, že zdraví nepřekročí maximum
    if (gameState.health > 100) {
        gameState.health = 100;
    }
    
    // Aktualizovat zobrazení
    updateHealthDisplay();
    
    // Kontrola, zda hráč nezemřel (zdraví <= 0)
    if (gameState.health <= 0) {
        gameState.health = 0;
        updateHealthDisplay();
        // Volat game over
        loadScene('gameOver');
        return true; // Signalizuje, že hráč zemřel
    }
    
    return false; // Hráč je stále naživu
}

// New function to display game over screen
function showGameOverScreen() {
    // Nastavení zdraví na 0 pro konzistenci
    gameState.health = 0;
    updateHealthDisplay();
    
    // Zjistit důvod smrti
    let deathReason = "";
    let deathImage = "images/game_over.jpg";
    
    // Určit důvod smrti podle aktuální scény
    const currentScene = gameState.currentScene;
    
    if (currentScene === 'studyResult' || currentScene.includes('study')) {
        deathReason = "Studijní stres byl příliš velký. Nekonečné projekty a deadliny tě úplně vyčerpaly.";
        deathImage = "images/game_over_study.jpg";
    } else if (currentScene.includes('gambl') || currentScene === 'slotMachinesResult' || currentScene === 'cardGamblingResult') {
        if (currentScene.includes('slot') || currentScene === 'slotMachinesResult') {
            deathReason = "Automaty tě naprosto pohltily. Jejich záře a sliby rychlého bohatství byly příliš lákavé, ale nakonec tě zničily.";
        } else {
            deathReason = "Gamblerství s kartami tě zničilo. Finanční stres a ztráta všech peněz byly příliš na tvou psychiku.";
        }
        deathImage = "images/game_over_gambling.jpg";
    } else if (gameState.money <= 0) {
        deathReason = "Nedostatek peněz na jídlo a únava z neustálého šetření tě dostaly.";
        deathImage = "images/game_over_money.jpg";
    } else if (currentScene.includes('repair')) {
        deathReason = "Riziko se nevyplatilo. Elektřina není kamarád. Stres z opravy počítačů a zodpovědnost byly příliš velké.";
        deathImage = "images/game_over_repair.jpg";
    } else {
        deathReason = "Kombinace stresu, nedostatku spánku a nároků školy byla příliš mnoho.";
        deathImage = "images/game_over.jpg";
    }
    
    // Skrýt herní scény
    nameInputContainer.style.display = 'none';
    
    // Přidat vizuální efekt konce hry
    document.body.style.backgroundColor = '#1a0000';
    document.body.style.transition = 'background-color 1s';
    
    // Zobrazit gameOver obrazovku - upravíme přímo herní plátno
    gameScreen.style.display = 'block';
    
    // Přidat zvukový či vizuální efekt (zde animace)
    document.body.classList.add('shake-effect');
    
    // Vytvořit HTML pro game over obrazovku
    gameScreen.innerHTML = `
        <div class="scene" id="gameOverScene" style="margin-bottom: 25px;">
            <div class="scene-image" style="background-image: url('${deathImage}'); border: 3px solid #f44336;"></div>
            <div class="scene-text game-over-container">
                <h2 class="game-over-title">GAME OVER</h2>
                <p class="game-over-reason">${deathReason}</p>
                <div class="game-over-stats">
                    <p>Vydržel jsi: ${gameState.days || 1} dnů ve škole</p>
                    <p>Konečný stav peněz: ${gameState.money} Kč</p>
                    <p>Zdraví: ${gameState.health}/100</p>
                </div>
            </div>
        </div>
        <div class="choices" style="margin-top: 20px; text-align: center;">
            <button class="choice-btn restart-btn" onclick="resetGame()">Začít znovu</button>
        </div>
    `;
    
    // Odstranit třesení po 1 sekundě
    setTimeout(() => {
        document.body.classList.remove('shake-effect');
    }, 1000);
}

// Function to update health display
function updateHealthDisplay() {
    healthBarElement.style.width = `${gameState.health}%`;
    healthTextElement.textContent = `${gameState.health}/100`;
    
    // Change color based on health level
    if (gameState.health > 70) {
        healthBarElement.style.backgroundColor = '#4dabf5';  // Blue for high health
        healthTextElement.style.color = '#a8b2d1';  // Default color
        healthBarElement.style.boxShadow = 'none';
    } else if (gameState.health > 30) {
        healthBarElement.style.backgroundColor = '#5c6bc0';  // Purple for medium health
        healthTextElement.style.color = '#a8b2d1';  // Default color
        healthBarElement.style.boxShadow = 'none';
    } else if (gameState.health > 15) {
        healthBarElement.style.backgroundColor = '#283593';  // Dark blue for low health
        healthTextElement.style.color = '#ff9800';  // Orange warning color
        healthBarElement.style.boxShadow = '0 0 10px rgba(255, 152, 0, 0.5)';
    } else {
        healthBarElement.style.backgroundColor = '#c62828';  // Red for critical health
        healthTextElement.style.color = '#f44336';  // Red warning color
        healthBarElement.style.boxShadow = '0 0 10px rgba(244, 67, 54, 0.8)';
        
        // Add pulsing animation for critical health
        healthBarElement.style.animation = 'pulse 1.5s infinite';
        
        // Show warning if health is critically low
        if (gameState.health <= 10 && !gameState.lowHealthWarningShown) {
            alert("Pozor! Tvé zdraví je na kritické úrovni. Pokud klesne na nulu, hra končí!");
            gameState.lowHealthWarningShown = true;
        }
    }
}

// Function to add item to inventory
function addToInventory(item) {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
        updateInventoryDisplay();
    }
}

// Function to remove item from inventory
function removeFromInventory(item) {
    const index = gameState.inventory.indexOf(item);
    if (index !== -1) {
        gameState.inventory.splice(index, 1);
        updateInventoryDisplay();
    }
}

// Function to update inventory display
function updateInventoryDisplay() {
    if (gameState.inventory.length === 0) {
        inventoryItemsElement.textContent = 'Prázdný';
        inventoryItemsDisplayElement.innerHTML = '<p>Žádné předměty</p>';
    } else {
        inventoryItemsElement.textContent = `${gameState.inventory.length} předmětů`;
        
        // Update detailed inventory display
        inventoryItemsDisplayElement.innerHTML = '';
        gameState.inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.setAttribute('data-name', item);
            
            // Create simple text representation of the item
            itemElement.textContent = item.charAt(0);
            
            inventoryItemsDisplayElement.appendChild(itemElement);
        });
    }
}

// Helper function to check if player has required items for final exam
function checkRequiredItems() {
    let requiredItems = ["Tiger energeťák", "Poznámky ze sítí", "Poznámky z programování"];
    let count = 0;
    
    requiredItems.forEach(item => {
        if (gameState.inventory.includes(item)) {
            count++;
        }
    });
    
    return {
        count: count,
        total: requiredItems.length,
        isReady: count === requiredItems.length
    };
}

// Funkce pro aktualizaci zbývajícího času projektu
function updateProjectTime() {
    gameState.visitCounter++;
    
    // Aktualizuj čas projektu jen pokud je zadaný a nedokončený
    if (gameState.projects.semesterProject.assigned && !gameState.projects.semesterProject.completed) {
        gameState.projects.semesterProject.remainingTime--;
        
        // Kontrola vypršení termínu
        if (gameState.projects.semesterProject.remainingTime === 0) {
            // Zobrazit upozornění při dalším přesunu
            alert("Právě vypršel termín odevzdání tvého projektu! Pokud ho co nejdříve neodevzdáš, budeš penalizován/a!");
        }
    }
}

// Function to update money
function updateMoney(amount) {
    gameState.money += amount;
    updateMoneyDisplay();
}

// Function to update money display
function updateMoneyDisplay() {
    if(moneyElement) {
        moneyElement.textContent = `${gameState.money} Kč`;
    }
}

// Initialize health display
updateHealthDisplay();
updateMoneyDisplay();

// Funkce pro animaci hracích automatů
function animateSlotMachine() {
    // Nastavit spinning třídy pro všechny symboly
    const symbols = document.querySelectorAll('.slot-symbol svg');
    symbols.forEach(symbol => {
        symbol.classList.remove('spinning');
        symbol.classList.add('spinning-fast');
    });
    
    // Po 2 sekundách zastavit animaci a přejít na další scénu
    setTimeout(() => {
        symbols.forEach(symbol => {
            symbol.classList.remove('spinning-fast');
        });
        
        // Přejít na další scénu po animaci
        if (gameState.nextSceneAfterAnimation) {
            loadScene(gameState.nextSceneAfterAnimation);
            gameState.nextSceneAfterAnimation = null;
        }
    }, 2000);
}

// Funkce pro získání SVG kódu pro symboly
function getSymbolSVG(symbolName) {
    switch(symbolName) {
        case 'seven':
            return '<text x="25" y="70" font-size="70" font-weight="bold" fill="#FF5722">7</text>';
        case 'diamond':
            return '<polygon points="50,10 90,50 50,90 10,50" fill="#2196F3" />';
        case 'bell':
            return '<path d="M50,15 Q70,15 70,40 Q70,65 50,80 Q30,65 30,40 Q30,15 50,15" fill="#FFD700" /><rect x="45" y="80" width="10" height="10" fill="#8D6E63" />';
        case 'cherry':
            return '<circle cx="30" cy="65" r="25" fill="#E91E63"/><circle cx="70" cy="65" r="25" fill="#E91E63"/><path d="M 30 35 Q 50 10 70 35" stroke-width="8" stroke="#5D4037" fill="none"/>';
        case 'bar':
            return '<rect x="20" y="30" width="60" height="15" fill="#FFC107" /><rect x="20" y="50" width="60" height="15" fill="#FFC107" /><rect x="20" y="70" width="60" height="15" fill="#FFC107" />';
        default:
            return '<text x="25" y="70" font-size="70" font-weight="bold">?</text>';
    }
}

function getExamQuestions() {
    return [
        {
            question: "Kdo napsal dílo R.U.R.?",
            options: ["Karel Čapek", "Josef Čapek", "Václav Havel", "Franz Kafka"],
            correctAnswer: "Karel Čapek"
        },
        {
            question: "Kdo napsal knihu Stařec a moře?",
            options: ["Ernest Hemingway", "F. Scott Fitzgerald", "Jack London", "John Steinbeck"],
            correctAnswer: "Ernest Hemingway"
        },
        {
            question: "Který z následujících je architektonický návrhový vzor?",
            options: ["Factory", "Singleton", "MVC", "Všechny uvedené"],
            correctAnswer: "Všechny uvedené"
        },
        {
            question: "Kolik vrstev má TCP/IP model?",
            options: ["3", "4", "5", "7"],
            correctAnswer: "4"
        },
        {
            question: "Kdo napsal Babičku?",
            options: ["Božena Němcová", "Karel Jaromír Erben", "Jan Neruda", "Alois Jirásek"],
            correctAnswer: "Božena Němcová"
        },
        {
            question: "Jak se jmenuje protokol používaný pro zabezpečené webové stránky?",
            options: ["HTTP", "FTP", "HTTPS", "SMTP"],
            correctAnswer: "HTTPS"
        },
        {
            question: "Co znamená zkratka CSS?",
            options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Control Style Solutions"],
            correctAnswer: "Cascading Style Sheets"
        },
        {
            question: "Který programovací jazyk je interpretovaný?",
            options: ["C++", "Java", "Python", "C#"],
            correctAnswer: "Python"
        },
        {
            question: "Co je to SQL?",
            options: ["Programovací jazyk", "Dotazovací jazyk pro databáze", "Operační systém", "Hardwarová komponenta"],
            correctAnswer: "Dotazovací jazyk pro databáze"
        },
        {
            question: "Kdo napsal román 1984?",
            options: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "J.R.R. Tolkien"],
            correctAnswer: "George Orwell"
        },
        {
            question: "Co je to PHP?",
            options: ["Preprocessor hypertextových dokumentů", "Programovací jazyk pro webové aplikace", "Databázový systém", "Webový prohlížeč"],
            correctAnswer: "Programovací jazyk pro webové aplikace"
        },
        {
            question: "Který prvek má chemickou značku Fe?",
            options: ["Fluor", "Železo", "Fosfor", "Fermium"],
            correctAnswer: "Železo"
        },
        {
            question: "Jaký význam má v HTML tag <div>?",
            options: ["Vytváří odkaz", "Definuje odstavec", "Vytváří oddíl dokumentu", "Vkládá obrázek"],
            correctAnswer: "Vytváří oddíl dokumentu"
        },
        {
            question: "Co znamená zkratka RAM?",
            options: ["Random Access Memory", "Read-Always Memory", "Runtime Application Memory", "Remote Access Module"],
            correctAnswer: "Random Access Memory"
        },
        {
            question: "Karel Čapek napsal dílo Válka s mloky. Ve kterém roce bylo vydáno?",
            options: ["1925", "1936", "1947", "1918"],
            correctAnswer: "1936"
        },
        {
            question: "K čemu slouží algoritmus?",
            options: ["K ukládání dat", "K šifrování zpráv", "K řešení problémů pomocí konečného počtu kroků", "K propojení počítačů"],
            correctAnswer: "K řešení problémů pomocí konečného počtu kroků"
        },
        {
            question: "Co je to proměnná v programování?",
            options: ["Kód programu", "Část paměti pojmenovaná identifikátorem", "Typ procesoru", "Neměnná hodnota"],
            correctAnswer: "Část paměti pojmenovaná identifikátorem"
        },
        {
            question: "Jaký je rozdíl mezi HTTP a HTTPS?",
            options: ["HTTPS je starší verze HTTP", "HTTPS je rychlejší než HTTP", "HTTPS používá šifrovanou komunikaci", "Není mezi nimi rozdíl"],
            correctAnswer: "HTTPS používá šifrovanou komunikaci"
        },
        {
            question: "K čemu slouží metoda GET v HTTP?",
            options: ["K posílání dat na server", "K získávání dat ze serveru", "K mazání dat na serveru", "K aktualizaci dat na serveru"],
            correctAnswer: "K získávání dat ze serveru"
        },
        {
            question: "Co je to rekurze v programování?",
            options: ["Způsob psaní kódu", "Opakování cyklu", "Funkce, která volá sama sebe", "Typ proměnné"],
            correctAnswer: "Funkce, která volá sama sebe"
        }
    ];
}

// Funkce pro zobrazení maturitní zkoušky
function showExam() {
    const questions = getExamQuestions();
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    
    displayExamQuestion(questions[currentQuestionIndex]);
    
    function displayExamQuestion(questionObj) {
        const sceneText = document.getElementById('sceneText');
        const choicesContainer = document.getElementById('choicesContainer');
        
        sceneText.innerHTML = `
            <h3>Otázka ${currentQuestionIndex + 1} z ${questions.length}</h3>
            <p>${questionObj.question}</p>
        `;
        
            choicesContainer.innerHTML = '';
            
        questionObj.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
            button.textContent = option;
                button.addEventListener('click', () => {
                if (option === questionObj.correctAnswer) {
                    correctAnswers++;
                }
                
                currentQuestionIndex++;
                
                if (currentQuestionIndex < questions.length) {
                    displayExamQuestion(questions[currentQuestionIndex]);
                } else {
                    showExamResults();
                    }
                });
                
                choicesContainer.appendChild(button);
            });
    }
    
    function showExamResults() {
        const sceneText = document.getElementById('sceneText');
        const choicesContainer = document.getElementById('choicesContainer');
        
        const passed = correctAnswers >= 18;
        
        sceneText.innerHTML = `
            <h3>Výsledky maturitní zkoušky</h3>
            <p>Správně zodpovězených otázek: ${correctAnswers} z ${questions.length}</p>
            <p>${passed ? 'Gratulujeme! Úspěšně jsi složil maturitní zkoušku!' : 'Bohužel jsi neuspěl. K úspěšnému složení bylo potřeba alespoň 18 správných odpovědí.'}</p>
        `;
        
            choicesContainer.innerHTML = '';
            
        const continueButton = document.createElement('button');
        continueButton.className = 'choice-btn';
        continueButton.textContent = 'Pokračovat';
        continueButton.addEventListener('click', () => {
            if (passed) {
                loadScene('graduation');
            } else {
                loadScene('examFailed');
            }
        });
        
        choicesContainer.appendChild(continueButton);
    }
    
    // Přidání možnosti podplatit učitele
    const bribeOption = document.createElement('button');
    bribeOption.textContent = 'Podplatit učitele (5000 peněz, 30% šance na úspěch)';
    bribeOption.classList.add('exam-option', 'bribe-option');
    bribeOption.addEventListener('click', function() {
        if (gameState.money >= 5000) {
            // Odečtení peněz za pokus o podplacení
            updateMoney(-5000);
            
            // 30% šance na úspěch
            if (Math.random() < 0.3) {
                // Úspěch
                alert('Učitel přijal úplatek! Úspěšně jste prošli zkouškou.');
                showExamResults(true); // Předáme true, což znamená úspěch
            } else {
                // Neúspěch - game over
                alert('Učitel odmítl úplatek a nahlásil vás! Game over.');
                showGameOverScreen('Byli jste vyloučeni za pokus o podplacení učitele!');
            }
        } else {
            alert('Nemáte dostatek peněz na podplacení učitele!');
        }
    });
    
    // Přidání tlačítka do UI
    document.querySelector('.exam-container').appendChild(bribeOption);
}

// Přidání otázek do herních scén
function addExamQuestions() {
    const questions = getExamQuestions();
    
    // Nejprve definujeme scény pro podplácení, aby existovaly před odkazováním na ně
    scenes.bribeSuccess = {
        text: function() {
            return `<h2 class="bribe-title">Úplatek přijat!</h2>
                <p>Profesor se rozhlédne kolem, rychle přebere obálku s penězi a strčí ji do kapsy saka.</p>
                <p>"Dobrá, uvidím co se dá dělat," zašeptá. "Výsledky budou... uspokojivé."</p>
                <p>Cítíte, jak se vám ulevilo, ale zároveň máte trochu výčitky svědomí.</p>
                <p>Díky úplatku jste získali svůj titul, i když ne zrovna čestným způsobem.</p>`;
        },
        image: "images/exam_test.jpg",
        choices: [
                { text: "Dokončit hru", nextScene: "gameEndingSuccess"}
        ]
    };
    
    scenes.bribeFailure = {
        text: function() {
            return `<h2 class="bribe-title">Úplatek odmítnut!</h2>
                <p>Profesor zrudne a prudce vstane ze židle.</p>
                <p>"CO SI TO DOVOLUJETE?!" vykřikne a praští pěstí do stolu. "Tohle je akademická půda, ne tržiště!"</p>
                <p>Během několika minut jste předvoláni před disciplinární komisi a vyloučeni ze školy.</p>
                <p>Váš pokus o podplacení ukončil vaši akademickou kariéru...</p>`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "Dokončit hru", nextScene: "gameEndingFail1"}
        ]
    };
    scenes.gameEndingSuccess = {
        text: function() {
            // Přidání CSS do textu scény
            return `<style>
                .ending-container {
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(32, 201, 151, 0.1));
                    border-radius: 10px;
                    padding: 20px;
                    border-left: 5px solid #28a745;
                    margin-bottom: 15px;
                }
                .ending-title {
                    color: #28a745;
                    font-size: 2em;
                    text-align: center;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
                }
                .stats-container {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                }
                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 5px;
                }
                .stat-value {
                    font-weight: bold;
                    color: #20c997;
                }
                .game-credits {
                    text-align: center;
                    margin-top: 20px;
                    font-style: italic;
                    color: #adb5bd;
                    font-size: 0.9em;
                }
            </style>
            
            <div class="ending-container">
                <h1 class="ending-title">🎓 ÚSPĚŠNĚ DOKONČENO 🎓</h1>
                
                <p>Gratulujeme! Úspěšně jsi dokončil střední školu a složil maturitní zkoušku. ${gameState.playerName ? gameState.playerName : "Student"}, můžeš být na sebe hrdý/á.</p>
                
                <p>Tvé úsilí a odhodlání tě dovedly až do konce. Nyní před tebou stojí nové výzvy - vysoká škola nebo kariéra. Ale to už je jiný příběh...</p>
                
                <div class="stats-container">
                    <h3>FINÁLNÍ STATISTIKY</h3>
                    <div class="stat-item">
                        <span>Zdraví:</span>
                        <span class="stat-value">${gameState.health}/100</span>
                    </div>
                    <div class="stat-item">
                        <span>Peníze:</span>
                        <span class="stat-value">${gameState.money} Kč</span>
                    </div>
                    <div class="stat-item">
                        <span>Předměty:</span>
                        <span class="stat-value">${gameState.inventory.length > 0 ? gameState.inventory.join(", ") : "žádné"}</span>
                    </div>
                </div>
                
                <div class="game-credits">
                    <p>S TÍMTO SE S VÁMI LOUČÍ TŘÍDA I4B</p>
                    <p>© PRŮMKA HELL 2025</p>
                </div>
            </div>`;
        },
        image: "images/graduation.jpg",
        choices: [
            { 
                text: "🔄 HRÁT ZNOVU", 
                nextScene: "intro", 
                action: () => {
                    resetGame(); // Resetuje hru pro nové hraní
                }
            },
            {
                text: "👋 KONEC",
                action: () => {
                    // Resetujeme herní stav před ukončením
                    resetGame();
                    
                    // Přesměrování na stránku Průmyslovky Jičín
                    window.location.href = "https://prumyslovkajicin.cz/";
                }
            }
        ]
    };
    
    scenes.gameEndingFail1 = {
        text: function() {
            return `<style>
                .game-over-container {
                    background: linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(33, 37, 41, 0.1));
                    border-radius: 10px;
                    padding: 20px;
                    border-left: 5px solid #dc3545;
                    margin-bottom: 15px;
                }
                .game-over-title {
                    color: #dc3545;
                    font-size: 2em;
                    text-align: center;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
                }
                .stats-container {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                }
                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 5px;
                }
                .stat-value-fail {
                    font-weight: bold;
                    color: #fd7e14;
                }
                .game-credits {
                    text-align: center;
                    margin-top: 20px;
                    font-style: italic;
                    color: #adb5bd;
                    font-size: 0.9em;
                }
            </style>
            
            <div class="game-over-container">
                <h1 class="game-over-title">⚠️ KONEC HRY ⚠️</h1>
                
                <p>Rozhodl/a jsi se vzdát svůj sen o maturitě. Život jde dál, ale ne vždy podle našich představ.</p>
                
                <p>Ne všichni jsou předurčeni k úspěchu na střední škole. Možná tvé pravé nadání leží někde jinde!</p>
                
                <div class="stats-container">
                    <h3>FINÁLNÍ STATISTIKY</h3>
                    <div class="stat-item">
                        <span>Zdraví:</span>
                        <span class="stat-value-fail">${gameState.health}/100</span>
                    </div>
                    <div class="stat-item">
                        <span>Peníze:</span>
                        <span class="stat-value-fail">${gameState.money} Kč</span>
                    </div>
                    <div class="stat-item">
                        <span>Předměty:</span>
                        <span class="stat-value-fail">${gameState.inventory.length > 0 ? gameState.inventory.join(", ") : "žádné"}</span>
                    </div>
                </div>
                
                <div class="game-credits">
                    <p>S TÍMTO SE S VÁMI LOUČÍ TŘÍDA I4B</p>
                    <p>© PRŮMKA HELL 2025</p>
                </div>
            </div>`;
        },
        image: "images/game_over.jpg",
        choices: [
            { 
                text: "🔄 HRÁT ZNOVU", 
                nextScene: "intro", 
                action: () => {
                    resetGame(); // Resetuje hru pro nové hraní
                }
            },
            {
                text: "👋 KONEC",
                action: () => {
                    // Resetujeme herní stav před ukončením
                    resetGame();
                    
                    // Přesměrování na stránku Průmyslovky Jičín
                    window.location.href = "https://prumyslovkajicin.cz/";
                }
            }
        ]
    };
    
    scenes.notEnoughMoney = {
        text: function() {
            return `<h2 class="bribe-title">Nedostatek peněz</h2>
                <p>Prohledáváte kapsy a zjišťujete, že nemáte dostatek peněz na podplacení učitele.</p>
                <p>Potřebujete alespoň 5000 Kč, ale máte pouze ${gameState.money} Kč.</p>
                <p>Budete muset zkoušku složit řádnou cestou.</p>`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "Vrátit se zpět", nextScene: "examStart" }
        ]
    };
    
    // Teprve potom definujeme hlavní scénu pro zkoušku
    scenes.examStart = {
        text: function() {
            return `<h2 class="exam-title">MATURITNÍ ZKOUŠKA</h2>
                <p>Nadešel čas maturitní zkoušky. Před tebou je 20 otázek.</p>
                <p>Pro úspěšné složení zkoušky musíš správně odpovědět alespoň na <strong>18 z nich</strong>.</p>
                <p class="exam-motto">Hodně štěstí, budeš ho potřebovat!</p>`;
        },
        image: "images/exam_test.jpg",
        choices: [
            { text: "🎓 ZAČÍT ZKOUŠKU", nextScene: "examQuestion1", action: () => {
                gameState.examScore = 0;
            }},
            { text: "💰 Podplatit učitele (5000 peněz)", action: () => {
                if (gameState.money >= 5000) {
                    // Odečtení peněz za pokus o podplacení
                    updateMoney(-5000);
                    
                    // 30% šance na úspěch
                    if (Math.random() < 0.3) {
                        // Úspěch
                        gameState.examScore = 20; // Maximální skóre
                        loadScene("bribeSuccess");
                    } else {
                        // Neúspěch - game over
                        loadScene("bribeFailure");
                    }
                } else {
                    loadScene("notEnoughMoney");
                }
            }}
        ]
    };
    
    // Pokračování s vytvářením scén pro otázky...
}

// Vytvoř scény pro každou otázku
for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const nextScene = i < questions.length - 1 ? `examQuestion${i+2}` : "examResults";
        
        scenes[`examQuestion${i+1}`] = {
        text: function() {
                return `<h3 class="question-number">Otázka ${i+1}/20</h3>
                <div class="question-text">${q.question}</div>`;
            },
            image: "images/exam_test.jpg",
            choices: q.options.map(option => {
                return {
                    text: option,
                    nextScene: nextScene,
                  action: () => {
                        if (option === q.correctAnswer) {
                            gameState.examScore += 1;
                        }
                    }
                };
            })
        };
    }
    
    // Vytvoř scénu pro výsledky
    scenes.examResults = {
        text: function() {
            const passed = gameState.examScore >= 18;
            const scoreClass = passed ? "success-score" : "fail-score";
            
            return `<h2 class="${passed ? 'success-title' : 'fail-title'}">VÝSLEDKY MATURITNÍ ZKOUŠKY</h2>
                <div class="result-container">
                    <p>Správně zodpovězených otázek: <span class="${scoreClass}">${gameState.examScore}/20</span></p>
                    <p>Požadovaný počet: <span class="required-score">18/20</span></p>
                </div>
                <div class="${passed ? 'success-message' : 'fail-message'}">
                    ${passed ? 
                        '<h3>🎓 GRATULUJEME! 🎓</h3><p>Úspěšně jsi složil maturitní zkoušku!</p>' : 
                        '<h3>❌ NEÚSPĚCH ❌</h3><p>Bohužel jsi neuspěl. K úspěšnému složení bylo potřeba alespoň 18 správných odpovědí.</p>'}
                </div>`;
        },
        image: function() {
            return gameState.examScore >= 18 ? "images/exam_success.jpg" : "images/exam_fail.jpg";
        },
        choices: function() {
            // Dynamicky vracíme různé volby podle toho, zda hráč uspěl nebo ne
            if (gameState.examScore >= 18) {
                return [
                    { 
                        text: "🎉 JDEME SLAVIT!",
                        nextScene: "gameEndingSuccess"
                    }
                ];
            } else {
                return [
                    { 
                        text: "😔 OPAKOVAT ZKOUŠKU",
                        nextScene: "examStart",
                        action: () => {
                            updateHealth(-10); // Neúspěch ubere trochu zdraví
                        }
                    },
                    {
                        text: "😨 VZDÁT TO", 
                        nextScene: "gameEndingFail"
                    }
                ];
            }
        }
    };
    
    // Přidej scénu pro úspěšné zakončení hry
    scenes.gameEndingSuccess = {
        text: function() {
            // Přidání CSS do textu scény
            return `<style>
                .ending-container {
                    background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(32, 201, 151, 0.1));
                    border-radius: 10px;
                    padding: 20px;
                    border-left: 5px solid #28a745;
                    margin-bottom: 15px;
                }
                .ending-title {
                    color: #28a745;
                    font-size: 2em;
                    text-align: center;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
                }
                .stats-container {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                }
                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 5px;
                }
                .stat-value {
                    font-weight: bold;
                    color: #20c997;
                }
                .game-credits {
                    text-align: center;
                    margin-top: 20px;
                    font-style: italic;
                    color: #adb5bd;
                    font-size: 0.9em;
                }
            </style>
            
            <div class="ending-container">
                <h1 class="ending-title">🎓 ÚSPĚŠNĚ DOKONČENO 🎓</h1>
                
                <p>Gratulujeme! Úspěšně jsi dokončil střední školu a složil maturitní zkoušku. ${gameState.playerName ? gameState.playerName : "Student"}, můžeš být na sebe hrdý/á.</p>
                
                <p>Tvé úsilí a odhodlání tě dovedly až do konce. Nyní před tebou stojí nové výzvy - vysoká škola nebo kariéra. Ale to už je jiný příběh...</p>
                
                <div class="stats-container">
                    <h3>FINÁLNÍ STATISTIKY</h3>
                    <div class="stat-item">
                        <span>Zdraví:</span>
                        <span class="stat-value">${gameState.health}/100</span>
                    </div>
                    <div class="stat-item">
                        <span>Peníze:</span>
                        <span class="stat-value">${gameState.money} Kč</span>
                    </div>
                    <div class="stat-item">
                        <span>Předměty:</span>
                        <span class="stat-value">${gameState.inventory.length > 0 ? gameState.inventory.join(", ") : "žádné"}</span>
                    </div>
                </div>
                
                <div class="game-credits">
                    <p>S TÍMTO SE S VÁMI LOUČÍ TŘÍDA I4B</p>
                    <p>© PRŮMKA HELL 2025</p>
                </div>
            </div>`;
        },
        image: "images/graduation.jpg",
        choices: [
            { 
                text: "🔄 HRÁT ZNOVU", 
                nextScene: "intro", 
                action: () => {
                    resetGame(); // Resetuje hru pro nové hraní
                }
            },
            {
                text: "👋 KONEC",
                action: () => {
                    // Resetujeme herní stav před ukončením
                    resetGame();
                    
                    // Přesměrování na stránku Průmyslovky Jičín
                    window.location.href = "https://prumyslovkajicin.cz/";
                }
            }
        ]
    };
    
    // Scéna pro neúspěšné zakončení hry
    scenes.gameEndingFail = {
        text: function() {
            return `<style>
                .game-over-container {
                    background: linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(33, 37, 41, 0.1));
                    border-radius: 10px;
                    padding: 20px;
                    border-left: 5px solid #dc3545;
                    margin-bottom: 15px;
                }
                .game-over-title {
                    color: #dc3545;
                    font-size: 2em;
                    text-align: center;
                    margin-bottom: 20px;
                    text-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
                }
                .stats-container {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                }
                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 5px;
                }
                .stat-value-fail {
                    font-weight: bold;
                    color: #fd7e14;
                }
                .game-credits {
                    text-align: center;
                    margin-top: 20px;
                    font-style: italic;
                    color: #adb5bd;
                    font-size: 0.9em;
                }
            </style>
            
            <div class="game-over-container">
                <h1 class="game-over-title">⚠️ KONEC HRY ⚠️</h1>
                
                <p>Rozhodl/a jsi se vzdát svůj sen o maturitě. Život jde dál, ale ne vždy podle našich představ.</p>
                
                <p>Ne všichni jsou předurčeni k úspěchu na střední škole. Možná tvé pravé nadání leží někde jinde!</p>
                
                <div class="stats-container">
                    <h3>FINÁLNÍ STATISTIKY</h3>
                    <div class="stat-item">
                        <span>Zdraví:</span>
                        <span class="stat-value-fail">${gameState.health}/100</span>
                    </div>
                    <div class="stat-item">
                        <span>Peníze:</span>
                        <span class="stat-value-fail">${gameState.money} Kč</span>
                    </div>
                    <div class="stat-item">
                        <span>Předměty:</span>
                        <span class="stat-value-fail">${gameState.inventory.length > 0 ? gameState.inventory.join(", ") : "žádné"}</span>
                    </div>
                </div>
                
                <div class="game-credits">
                    <p>S TÍMTO SE S VÁMI LOUČÍ TŘÍDA I4B</p>
                    <p>© PRŮMKA HELL 2025</p>
                </div>
            </div>`;
        },
        image: "images/game_over.jpg",
        choices: [
            { 
                text: "🔄 HRÁT ZNOVU", 
                nextScene: "intro", 
                action: () => {
                    resetGame(); // Resetuje hru pro nové hraní
                }
            },
            {
                text: "👋 KONEC",
                action: () => {
                    // Resetujeme herní stav před ukončením
                    resetGame();
                    
                    // Přesměrování na stránku Průmyslovky Jičín
                    window.location.href = "https://prumyslovkajicin.cz/";
                }
            }
        ]
    };


// Také je potřeba přidat toto CSS do styly.css, nebo ho přidat inline do loadScene funkce
function injectExamStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .exam-title {
            color: #64ffda;
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.8em;
            text-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
        }
        
        .exam-motto {
            font-style: italic;
            color: #f8f9fa;
            margin-top: 15px;
            text-align: center;
        }
        
        .question-number {
            color: #64ffda;
            margin-bottom: 15px;
            font-size: 1.2em;
        }
        
        .question-text {
            font-size: 1.2em;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .success-title {
            color: #28a745;
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
        }
        
        .fail-title {
            color: #dc3545;
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
        }
        
        .result-container {
            background-color: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .success-score {
            color: #28a745;
            font-weight: bold;
            font-size: 1.2em;
        }
        
        .fail-score {
            color: #dc3545;
            font-weight: bold;
            font-size: 1.2em;
        }
        
        .required-score {
            color: #ffc107;
            font-weight: bold;
        }
        
        .success-message {
            background: linear-gradient(135deg, rgba(40, 167, 69, 0.2), rgba(40, 167, 69, 0.1));
            padding: 15px;
            border-radius: 8px;
            border-left: 5px solid #28a745;
            text-align: center;
        }
        
        .success-message h3 {
            color: #28a745;
            margin-bottom: 10px;
        }
        
        .fail-message {
            background: linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(220, 53, 69, 0.1));
            padding: 15px;
            border-radius: 8px;
            border-left: 5px solid #dc3545;
            text-align: center;
        }
        
        .fail-message h3 {
            color: #dc3545;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(styleElement);
}
