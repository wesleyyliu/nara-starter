document.addEventListener("DOMContentLoaded", () => {
  const backgroundContainer = document.createElement("div");
  backgroundContainer.className = "background-container";
  document.body.appendChild(backgroundContainer);

  const categoriesContainer = document.getElementById("categories-container");
  const tasksContainer = document.getElementById("tasks-container");
  const taskList = document.getElementById("task-list");
  const resetButton = document.getElementById("reset-button");
  const resetModal = document.getElementById("reset-modal");
  const resetYesButton = document.getElementById("reset-yes");
  const resetNoButton = document.getElementById("reset-no");

  // for controlling when hovers are active
  let hoverListeners = [];

  // Initial background image with 5 deers
  const initialBackground = "assets/original.jpg";

  // Background images for each category
  const backgroundSets = {
    daily: [
      "assets/A.png",
      "assets/A1.png",
      "assets/A2.png",
      "assets/A3.png",
      "assets/A4.png",
      "assets/A5.png",
    ],
    home: [
      "assets/B.png",
      "assets/B1.png",
      "assets/B2.png",
      "assets/B3.png",
      "assets/B4.png",
      "assets/B5.png",
    ],
    pet: [
      "assets/C.png",
      "assets/C1.png",
      "assets/C2.png",
      "assets/C3.png",
      "assets/C4.png",
      "assets/C5.png",
    ],
    friends: [
      "assets/D.png",
      "assets/D1.png",
      "assets/D2.png",
      "assets/D3.png",
      "assets/D4.png",
      "assets/D5.png",
    ],
    mind: [
      "assets/E.png",
      "assets/E1.png",
      "assets/E2.png",
      "assets/E3.png",
      "assets/E4.png",
      "assets/E5.png",
    ],
    others: [
      "assets/F.png",
      "assets/F1.png",
      "assets/F2.png",
      "assets/F3.png",
      "assets/F4.png",
      "assets/F5.png",
    ],
  };

  // Modify the hover effect logic to make it responsive
  const deerAreas = [
    {
      id: "deer1",
      top: 530,
      left: 380,
      width: 150,
      height: 250,
      circleImage: "assets/circle_selfcare.png",
      category: "daily",
    },
    {
      id: "deer2",
      top: 520,
      left: 1350,
      width: 100,
      height: 200,
      circleImage: "assets/circle_lovedones.png",
      category: "friends",
    },
    {
      id: "deer3",
      top: 530,
      left: 1150,
      width: 100,
      height: 200,
      circleImage: "assets/circle_pets.png",
      category: "pet",
    },
    {
      id: "deer4",
      top: 540,
      left: 700,
      width: 120,
      height: 220,
      circleImage: "assets/circle_thehome.png",
      category: "home",
    },
    {
      id: "deer5",
      top: 500,
      left: 1000,
      width: 90,
      height: 160,
      circleImage: "assets/circle_themind.png",
      category: "mind",
    },
    {
      id: "deer6",
      top: 30,
      left: 1140,
      width: 150,
      height: 150,
      circleImage: "assets/circle_somethingelse.png",
      category: "others",
    },
  ];

  function removeAllListeners() {
    hoverListeners.forEach((listener) => {
      document.removeEventListener("mousemove", listener);
      document.removeEventListener("click", listener);
    });
    hoverListeners = [];
  }

  deerAreas.forEach((area) => {
    const circle = document.getElementById(`${area.id}-circle`);
    circle.style.backgroundImage = `url(${area.circleImage})`;

    const circleWidth = getComputedStyle(circle).width || "200px";
    const size = parseInt(circleWidth);
    circle.style.left = `${area.left + area.width / 2 - size / 2}px`;
    circle.style.top = `${area.top + area.height / 2 - size / 2}px`;

    const checkHover = (e) => {
      const mouseX = e.pageX;
      const mouseY = e.pageY;

      if (
        mouseX >= area.left &&
        mouseX <= area.left + area.width &&
        mouseY >= area.top &&
        mouseY <= area.top + area.height
      ) {
        circle.classList.add("active");
      } else {
        circle.classList.remove("active");
      }
    };

    // Store listener reference for later removal
    hoverListeners.push(checkHover);
    document.addEventListener("mousemove", checkHover);

    const handleClick = (e) => {
      if (!circle.classList.contains("hidden")) {
        // Only handle clicks when circles are visible
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        if (
          mouseX >= area.left &&
          mouseX <= area.left + area.width &&
          mouseY >= area.top &&
          mouseY <= area.top + area.height
        ) {
          const categoryButton = document.querySelector(
            `.category-button[data-category="${area.category}"]`
          );
          if (categoryButton) {
            categoryButton.click();
            removeAllListeners(); // Remove listeners after category selection
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    hoverListeners.push(handleClick);
  });

  // Preload image function
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = reject;
      img.src = url;
    });
  }

  // Function to change background with slide effect
  async function changeBackgroundWithSlide(newImageUrl) {
    try {
      // Preload the new image first
      await preloadImage(newImageUrl);

      return new Promise((resolve) => {
        const currentBg =
          backgroundContainer.querySelector(".background-slide");
        const newBg = document.createElement("div");
        newBg.className = "background-slide";

        // Set initial opacity to 0
        newBg.style.opacity = "0";
        newBg.style.backgroundImage = `url(${newImageUrl})`;

        // Add the new background
        backgroundContainer.appendChild(newBg);

        // Force a reflow to ensure the opacity transition works
        newBg.offsetHeight;

        // Fade in the new background
        requestAnimationFrame(() => {
          newBg.style.opacity = "1";

          if (currentBg) {
            // Start fading out the old background
            currentBg.style.opacity = "0";

            // Remove the old background after transition
            currentBg.addEventListener(
              "transitionend",
              () => {
                currentBg.remove();
                // Show a new inspirational quote with each background change
                showInspirationQuote();
                resolve();
              },
              { once: true }
            );
          } else {
            // Show a new inspirational quote with each background change
            showInspirationQuote();
            resolve();
          }
        });
      });
    } catch (error) {
      console.error("Error loading image:", error);
      return Promise.resolve();
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to hide hover circles
  function hideHoverCircles() {
    const hoverCircles = document.querySelectorAll(".deer-circle");
    hoverCircles.forEach((circle) => {
      circle.classList.add("hidden");
    });
  }

  // Function to show hover circles
  function showHoverCircles() {
    const hoverCircles = document.querySelectorAll(".deer-circle");
    hoverCircles.forEach((circle) => {
      circle.classList.remove("hidden");
    });
  }

  // Updated hardcoded tasks with new categories and random selection
  const taskPool = {
    daily: [
      "Brush teeth for two minutes",
      "Take a relaxing shower",
      "Eat a yummy breakfast",
      "Go for a refreshing 20 minute walk",
      "Change into your favorite outfit",
      "Brush your beautiful hair",
      "Floss between all your teeth",
      "Drink three full glasses of water",
      "Eat a serving of fruits or vegetables",
      "Tidy up your bed",
      "Trim your nails",
      "Moisturize your face and body",
      "Take your medications or vitamins",
      "Put on sunscreen",
      "Take five minutes to shave",
    ],
    home: [
      "Wipe down kitchen counters and stove",
      "Vacuum your space",
      "Empty trash bins and replace bags",
      "Load or unload the dishwasher",
      "Make your bed",
      "Clean your bathroom sink, mirror, and toilet",
      "Sweep or mop the floors",
      "Stow away your clutter",
      "Wipe dining table and chairs",
      "Clean the inside of the microwave",
      "Sort mail and papers",
      "Water your plants",
      "Do a quick dusting of surfaces",
      "Put all your stray clothes in the hamper",
      "Organize your desk",
      "Do a load of laundry",
      "Wipe your electronic surfaces clean",
    ],
    pet: [
      "Provide fresh water in bowl",
      "Clean feeding area",
      "Brush fur",
      "Have dedicated playtime together",
      "Give healthy treats as rewards",
      "Monitor food and water intake",
      "Give pets attention and affection",
      "Check skin/coat for any abnormalities",
    ],
    friends: [
      "Send a thoughtful text message to someone you love",
      "Schedule a catch-up call/coffee",
      "Tell someone a nice compliment",
      "Wish someone a happy birthday today",
      "Give a meaningful compliment",
      "Share a memory/photo with someone",
      "Write a handwritten note",
      "Plan a meetup with some friends",
      "Send a short text to a friend you have not heard from lately",
      "Congratulate someone on a recent achievement",
    ],
    mind: [
      "Take 5 minutes to practice mindful breathing",
      "Write 3 things you are grateful for",
      "Listen to calming music",
      "Practice a 5 minute meditation",
      "Journal your current feelings down for ten minutes",
      "Read a chapter of your new book",
      "Follow a 10 minute stretching Youtube video",
      "Write down a list of 3 affirmations for yourself",
      "Organize one small space in your home",
      "Go outside for at least 20 minutes of fresh air",
      "Do one creative activity",
      "Practice Duolingo for 10 minutes",
    ],
  };

  // Function to get 5 random tasks from a category
  function getRandomTasks(category) {
    const tasks = taskPool[category];
    return shuffleArray([...tasks]).slice(0, 5);
  }

  const hardcodedTasks = {
    daily: getRandomTasks("daily"),
    home: getRandomTasks("home"),
    pet: getRandomTasks("pet"),
    friends: getRandomTasks("friends"),
    mind: getRandomTasks("mind"),
  };

  let sortableInstance = null;

  // Load saved state from chrome.storage.local
  chrome.storage.local.get("state", (data) => {
    if (data.state) {
      const {
        tasks,
        backgroundIndex,
        categoriesHidden,
        isFinalImage,
        selectedCategory,
      } = data.state;

      if (isFinalImage) {
        changeBackgroundWithSlide(
          backgroundSets[selectedCategory][
            backgroundSets[selectedCategory].length - 1
          ]
        ).then(() => {
          tasksContainer.classList.add("hidden");
          categoriesContainer.classList.add("hidden");
          hideHoverCircles(); // Hide hover circles when the final image is shown
          document.getElementById("welcome-message").classList.add("hidden");

          // Create and show thank you message
          const thankYouMessage = document.createElement("div");
          thankYouMessage.className = "thank-you-message";
          thankYouMessage.textContent = "Thank you for taking good care of me";
          document.body.appendChild(thankYouMessage);
        });
      } else {
        renderTasks(tasks, backgroundIndex, selectedCategory);
        if (categoriesHidden) {
          categoriesContainer.classList.add("hidden");
          hideHoverCircles(); // Hide hover circles when categories are hidden
          document.getElementById("welcome-message").classList.add("hidden");
        }
        changeBackgroundWithSlide(
          backgroundSets[selectedCategory][backgroundIndex]
        );
      }
    } else {
      //categoriesContainer.classList.remove("hidden");
      document.getElementById("welcome-message").classList.remove("hidden");
      showHoverCircles(); // Show hover circles in the initial state
      changeBackgroundWithSlide(initialBackground);
    }
  });

  categoriesContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("category-button")) {
      const category = event.target.dataset.category;
      hideHoverCircles();

      if (category === "others") {
        // Create five empty tasks for the "Others" category
        const tasks = Array(5)
          .fill()
          .map(() => ({
            text: "",
            completed: false,
          }));

        chrome.storage.local.set({
          state: {
            tasks,
            backgroundIndex: 0,
            categoriesHidden: true,
            isFinalImage: false,
            selectedCategory: category,
          },
        });

        // Set the background to the category's origin photo (e.g., A.jpg)
        changeBackgroundWithSlide(backgroundSets[category][0]).then(() => {
          // Render the empty tasks
          renderTasks(tasks, 0, category);
        });
      } else {
        const tasks = hardcodedTasks[category].map((task) => ({
          text: task,
          completed: false,
        }));
        chrome.storage.local.set({
          state: {
            tasks,
            backgroundIndex: 0,
            categoriesHidden: true,
            isFinalImage: false,
            selectedCategory: category,
          },
        });
        // Set the background to the category's origin photo (e.g., A.jpg)
        changeBackgroundWithSlide(backgroundSets[category][0]).then(() => {
          renderTasks(tasks, 0, category);
        });
      }

      categoriesContainer.classList.add("hidden");
      hideHoverCircles();
      document.getElementById("welcome-message").classList.add("hidden");
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateSubtasks") {
      const tasks = message.subtasks.map((task) => ({
        text: task,
        completed: false,
      }));
      chrome.storage.local.set({
        state: {
          tasks,
          backgroundIndex: 0,
          categoriesHidden: true,
          isFinalImage: false,
          selectedCategory: "others",
        },
      });
      renderTasks(tasks, 0, "self");
    }
  });

  // Show the reset modal when the reset button is clicked
  resetButton.addEventListener("click", () => {
    resetModal.classList.remove("hidden");
  });

  // Hide the reset modal when "No" is clicked
  resetNoButton.addEventListener("click", () => {
    resetModal.classList.add("hidden");
  });

  // Reset everything when "Yes" is clicked
  resetYesButton.addEventListener("click", () => {
    // Clear the state in chrome.storage.local
    chrome.storage.local.set({ state: null }, () => {
      console.log("State reset to initial state.");
    });

    // Reset the UI to the initial state
    tasksContainer.classList.add("hidden");
    document.getElementById("welcome-message").classList.remove("hidden");
    changeBackgroundWithSlide(initialBackground);

    // Remove thank you message if it exists
    const thankYouMessage = document.querySelector(".thank-you-message");
    if (thankYouMessage) {
      thankYouMessage.remove();
    }

    // Reattach hover listeners
    deerAreas.forEach((area) => {
      const circle = document.getElementById(`${area.id}-circle`);

      const checkHover = (e) => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        if (
          mouseX >= area.left &&
          mouseX <= area.left + area.width &&
          mouseY >= area.top &&
          mouseY <= area.top + area.height
        ) {
          circle.classList.add("active");
        } else {
          circle.classList.remove("active");
        }
      };

      const handleClick = (e) => {
        if (!circle.classList.contains("hidden")) {
          const mouseX = e.pageX;
          const mouseY = e.pageY;

          if (
            mouseX >= area.left &&
            mouseX <= area.left + area.width &&
            mouseY >= area.top &&
            mouseY <= area.top + area.height
          ) {
            const categoryButton = document.querySelector(
              `.category-button[data-category="${area.category}"]`
            );
            if (categoryButton) {
              categoryButton.click();
              removeAllListeners();
            }
          }
        }
      };

      document.addEventListener("mousemove", checkHover);
      document.addEventListener("click", handleClick);
      hoverListeners.push(checkHover, handleClick);
      circle.classList.remove("hidden");
    });

    // Hide the reset modal
    resetModal.classList.add("hidden");
  });

  function updateBackgroundState(tasks, selectedCategory) {
    const tasksWithContent = tasks.filter((task) => task.text.trim() !== "");
    const completedTasks = tasks.filter(
      (task) => task.completed && task.text.trim() !== ""
    ).length;
    const totalTasksWithContent = tasksWithContent.length;

    let backgroundIndex;
    let isFinalImage = false;

    if (selectedCategory === "others") {
      // For "others" category, increment background based on completed tasks
      backgroundIndex = Math.min(
        completedTasks,
        backgroundSets[selectedCategory].length - 2
      );

      // Only show final image when ALL tasks with content are completed
      if (
        completedTasks === totalTasksWithContent &&
        totalTasksWithContent > 0
      ) {
        backgroundIndex = backgroundSets[selectedCategory].length - 1;
        isFinalImage = true;
      }
    } else {
      // Original logic for other categories
      if (
        completedTasks === totalTasksWithContent &&
        totalTasksWithContent > 0
      ) {
        backgroundIndex = backgroundSets[selectedCategory].length - 1;
        isFinalImage = true;
      } else {
        backgroundIndex = Math.min(
          completedTasks,
          backgroundSets[selectedCategory].length - 1
        );
      }
    }

    return { backgroundIndex, isFinalImage };
  }

  function sortTasksByCompletion(tasks) {
    return [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? -1 : 1;
    });
  }

  // Array of encouraging messages for the speech bubble
  const encouragingMessages = [
    "Great job!",
    "You're making progress!",
    "Keep going!",
    "Excellent work!",
    "You're doing amazing!",
    "Well done!",
    "That's the spirit!",
    "Fantastic effort!",
    "You got this!",
    "One step closer!",
    "Proud of you!",
    "Amazing work!",
    "Look at you go!",
    "You're on fire!",
    "Crushing it!",
  ];
  
  // Array of inspirational quotes for the overlay
  const inspirationalQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "The power of imagination makes us infinite.", author: "John Muir" },
    { text: "Wherever you go, go with all your heart.", author: "Confucius" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  ];
  
  // Hardcoded positions for speech bubbles for each deer background
  const speechBubblePositions = {
    daily: [
      {left: 1000, top: 400},
    ],
    home: [
      {left: 1000, top: 570},
    ],
    pet: [
      {left: 1000, top: 500},
    ],
    friends: [
      {left: 1200, top: 500},
    ],
    mind: [
      {left: 1050, top: 500},
    ],
    others: [
      {left: 600, top: 250},
    ]
  };
  
  // Show a speech bubble with an encouraging message near the deer
  function showSpeechBubble(category, backgroundIndex) {
    // Remove any existing speech bubbles
    const existingBubble = document.querySelector('.speech-bubble');
    if (existingBubble) {
      existingBubble.remove();
    }
    
    // Create a new speech bubble
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    
    // Get a random encouraging message
    const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
    bubble.textContent = encouragingMessages[randomIndex];
    
    // Get position for the current category and background index
    // Index is 0-based in the array but 1-based in the parameter
    const position = speechBubblePositions[category][0]
    
    bubble.style.left = `${position.left}px`;
    bubble.style.top = `${position.top}px`;
    
    // Add the bubble to the page
    document.body.appendChild(bubble);
    
    // Animate the bubble
    setTimeout(() => {
      bubble.style.opacity = '1';
    }, 10);
    
    // Remove the bubble after 3 seconds
    setTimeout(() => {
      bubble.style.opacity = '0';
      setTimeout(() => {
        bubble.remove();
      }, 500);
    }, 3000);
  }
  
  // Function to display an inspirational quote overlay in the top right corner
  function showInspirationQuote() {
    // Remove any existing quote overlays
    const existingQuote = document.querySelector('.quote-overlay');
    if (existingQuote) {
      existingQuote.remove();
    }
    
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    const quote = inspirationalQuotes[randomIndex];
    
    // Create the quote overlay
    const quoteOverlay = document.createElement('div');
    quoteOverlay.className = 'quote-overlay';
    
    // Set explicit positioning and styling
    quoteOverlay.style.position = 'fixed';
    quoteOverlay.style.top = '10px';
    quoteOverlay.style.right = '20px';
    quoteOverlay.style.width = '200px';
    quoteOverlay.style.height = '50px';
    quoteOverlay.style.overflow = 'auto';
    quoteOverlay.style.padding = '6px 8px';
    quoteOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    quoteOverlay.style.borderRadius = '5px';
    quoteOverlay.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.1)';
    quoteOverlay.style.zIndex = '1000';
    quoteOverlay.style.fontSize = '11px';
    quoteOverlay.style.lineHeight = '1.2';
    quoteOverlay.style.textAlign = 'right';
    
    // Truncate long quotes
    let displayText = quote.text;
    if (displayText.length > 70) {
      displayText = displayText.substring(0, 67) + '...';
    }
    
    // Create inner content elements
    const quoteText = document.createElement('div');
    quoteText.style.fontStyle = 'italic';
    quoteText.style.marginBottom = '3px';
    quoteText.textContent = `"${displayText}"`;
    
    const quoteAuthor = document.createElement('div');
    quoteAuthor.style.fontWeight = 'bold';
    quoteAuthor.style.fontSize = '10px';
    quoteAuthor.textContent = `- ${quote.author}`;
    
    // Add content to the overlay
    quoteOverlay.appendChild(quoteText);
    quoteOverlay.appendChild(quoteAuthor);
    
    // Add the quote overlay to the page - append to body to ensure it's not constrained by other elements
    document.body.appendChild(quoteOverlay);
  }

  function renderTasks(tasks, backgroundIndex, category) {
    const tasksHeader =
      document.getElementById("tasks-header") || document.createElement("div");
    tasksHeader.id = "tasks-header";
    tasksHeader.innerHTML = `
      <h1 class="task-title">today's list</h1>
      <p class="task-subtitle">some tasks to help you feel good</p>
    `;

    if (!document.getElementById("tasks-header")) {
      tasksContainer.innerHTML = "";
      tasksContainer.appendChild(tasksHeader);

      const newTaskList = document.createElement("ul");
      newTaskList.id = "task-list";
      tasksContainer.appendChild(newTaskList);
    }

    const taskListElement = document.getElementById("task-list");
    taskListElement.innerHTML = "";

    const sortedTasks = sortTasksByCompletion(tasks);

    sortedTasks.forEach((task, index) => {
      const taskItem = document.createElement("li");
      taskItem.classList.add("draggable");
      taskItem.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} />
        <div class="task-text" contenteditable="true" placeholder="New task">${
          task.text
        }</div>
        ${
          task.text && !task.completed
            ? `<button class="delete-task"></button>`
            : ""
        }
        <div class="drag-handle">
         <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      `;

      taskItem.draggable = true;
      taskItem.dataset.index = tasks.indexOf(task);

      const checkbox = taskItem.querySelector("input[type='checkbox']");
      checkbox.addEventListener("change", (event) => {
        const originalIndex = tasks.indexOf(task);
        tasks[originalIndex].completed = checkbox.checked;
        
        // Show speech bubble with encouraging message when task is checked
        if (checkbox.checked) {
          // Get the current background index after updating
          const { backgroundIndex: newBackgroundIndex } = updateBackgroundState(tasks, category);
          // Show speech bubble near the deer for the current background
          showSpeechBubble(category, newBackgroundIndex);
        }

        let newPosition = 0;
        if (checkbox.checked) {
          newPosition = tasks.filter(
            (t, i) => t.completed && i < originalIndex
          ).length;
        } else {
          newPosition = tasks.filter((t) => t.completed).length;
        }

        const [movedTask] = tasks.splice(originalIndex, 1);
        tasks.splice(newPosition, 0, movedTask);

        const { backgroundIndex: newBackgroundIndex, isFinalImage } =
          updateBackgroundState(tasks, category);

        if (isFinalImage) {
          changeBackgroundWithSlide(
            backgroundSets[category][backgroundSets[category].length - 1]
          ).then(() => {
            tasksContainer.classList.add("hidden");
            categoriesContainer.classList.add("hidden");
            hideHoverCircles(); // Hide hover circles when the final image is shown
            document.getElementById("welcome-message").classList.add("hidden");
            // Create and show thank you message
            const thankYouMessage = document.createElement("div");
            thankYouMessage.className = "thank-you-message";
            thankYouMessage.textContent =
              "Thank you for taking good care of me";
            document.body.appendChild(thankYouMessage);
          });
        } else {
          changeBackgroundWithSlide(
            backgroundSets[category][newBackgroundIndex]
          );
        }

        chrome.storage.local.set({
          state: {
            tasks,
            backgroundIndex: newBackgroundIndex,
            categoriesHidden: true,
            isFinalImage,
            selectedCategory: category,
          },
        });

        if (sortableInstance) {
          const taskItems = Array.from(taskListElement.children);
          const oldItemEl = taskItems[originalIndex];

          taskListElement.removeChild(oldItemEl);
          taskListElement.insertBefore(
            oldItemEl,
            taskListElement.children[newPosition]
          );

          sortableInstance.option("animation", 600);
          sortableInstance.option("onEnd", null);
          const evt = new CustomEvent("sortable:start");
          taskListElement.dispatchEvent(evt);

          oldItemEl.style.transition = "all 600ms ease";
          oldItemEl.style.animation = "moveTask 600ms ease";

          setTimeout(() => {
            oldItemEl.style.transition = "";
            oldItemEl.style.animation = "";
          }, 600);
        }
      });

      const taskTextInput = taskItem.querySelector(".task-text");
      taskTextInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent the default behavior (new line)
          taskTextInput.blur(); // Exit edit mode
        }
      });

      taskTextInput.addEventListener("input", () => {
        const originalIndex = tasks.indexOf(task);
        tasks[originalIndex].text = taskTextInput.textContent;

        const existingDeleteButton = taskItem.querySelector(".delete-task");

        if (
          tasks[originalIndex].text.trim() !== "" &&
          !tasks[originalIndex].completed &&
          !existingDeleteButton
        ) {
          const deleteButton = document.createElement("button");
          deleteButton.className = "delete-task";

          deleteButton.addEventListener("click", () => {
            tasks.splice(originalIndex, 1);

            if (tasks.length < 5) {
              tasks.push({ text: "", completed: false });
            }

            const { backgroundIndex: newBackgroundIndex, isFinalImage } =
              updateBackgroundState(tasks, category);

            if (isFinalImage) {
              changeBackgroundWithSlide(
                backgroundSets[category][backgroundSets[category].length - 1]
              ).then(() => {
                tasksContainer.classList.add("hidden");
                categoriesContainer.classList.add("hidden");
                document
                  .getElementById("welcome-message")
                  .classList.add("hidden");
                // Create and show thank you message
                const thankYouMessage = document.createElement("div");
                thankYouMessage.className = "thank-you-message";
                thankYouMessage.textContent =
                  "Thank you for taking good care of me";
                document.body.appendChild(thankYouMessage);
              });
            } else {
              changeBackgroundWithSlide(
                backgroundSets[category][newBackgroundIndex]
              );
            }

            chrome.storage.local.set({
              state: {
                tasks,
                backgroundIndex: newBackgroundIndex,
                categoriesHidden: true,
                isFinalImage,
                selectedCategory: category,
              },
            });

            renderTasks(tasks, backgroundIndex, category);
          });
          taskItem.appendChild(deleteButton);
        }

        chrome.storage.local.set({
          state: {
            tasks,
            backgroundIndex,
            categoriesHidden: true,
            isFinalImage: false,
            selectedCategory: category,
          },
        });
      });

      const deleteButton = taskItem.querySelector(".delete-task");
      if (deleteButton) {
        deleteButton.addEventListener("click", () => {
          const originalIndex = tasks.indexOf(task);
          tasks.splice(originalIndex, 1);

          if (tasks.length < 5) {
            tasks.push({ text: "", completed: false });
          }

          const { backgroundIndex: newBackgroundIndex, isFinalImage } =
            updateBackgroundState(tasks, category);

          if (isFinalImage) {
            changeBackgroundWithSlide(
              backgroundSets[category][backgroundSets[category].length - 1]
            ).then(() => {
              tasksContainer.classList.add("hidden");
              categoriesContainer.classList.add("hidden");
              document
                .getElementById("welcome-message")
                .classList.add("hidden");
              // Create and show thank you message
              const thankYouMessage = document.createElement("div");
              thankYouMessage.className = "thank-you-message";
              thankYouMessage.textContent =
                "Thank you for taking good care of me";
              document.body.appendChild(thankYouMessage);
            });
          } else {
            changeBackgroundWithSlide(
              backgroundSets[category][newBackgroundIndex]
            );
          }

          chrome.storage.local.set({
            state: {
              tasks,
              backgroundIndex: newBackgroundIndex,
              categoriesHidden: true,
              isFinalImage,
              selectedCategory: category,
            },
          });

          renderTasks(tasks, newBackgroundIndex, category);
        });
      }

      taskListElement.appendChild(taskItem);

      if (!document.querySelector("#task-animations")) {
        const style = document.createElement("style");
        style.id = "task-animations";
        style.textContent = `
          @keyframes moveTask {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    });

    // Initialize or update SortableJS
    if (sortableInstance) {
      sortableInstance.destroy();
    }

    sortableInstance = new Sortable(taskListElement, {
      animation: 600,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",

      onUpdate: (evt) => {
        const [movedTask] = tasks.splice(evt.oldIndex, 1);
        tasks.splice(evt.newIndex, 0, movedTask);

        const { backgroundIndex: newBackgroundIndex, isFinalImage } =
          updateBackgroundState(tasks, category);

        if (isFinalImage) {
          changeBackgroundWithSlide(
            backgroundSets[category][backgroundSets[category].length - 1]
          ).then(() => {
            tasksContainer.classList.add("hidden");
            categoriesContainer.classList.add("hidden");
            document.getElementById("welcome-message").classList.add("hidden");
            // Create and show thank you message
            const thankYouMessage = document.createElement("div");
            thankYouMessage.className = "thank-you-message";
            thankYouMessage.textContent =
              "Thank you for taking good care of me";
            document.body.appendChild(thankYouMessage);
          });
        } else {
          changeBackgroundWithSlide(
            backgroundSets[category][newBackgroundIndex]
          );
        }

        chrome.storage.local.set({
          state: {
            tasks,
            backgroundIndex: newBackgroundIndex,
            categoriesHidden: true,
            isFinalImage,
            selectedCategory: category,
          },
        });
      },
    });

    tasksContainer.classList.remove("hidden");
  }
});
