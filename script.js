// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/*
// Navbar background change on scroll Removed because the navbar element is not consistently present with dynamic content loading.
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.boxShadow = 'none';
    }
});
*/

// Form submission handling
const contactForm = document.querySelector('.contact-form');

// Chess piece navigation - Reverted to call navigateToSection
// document.querySelectorAll('.chess-piece').forEach(piece => {
//     piece.addEventListener('click', function(event) {
//         event.preventDefault();
//         const section = this.dataset.section;
//         if (section) {
//             navigateToSection(section);
//         }
//     });
// });

// Pawn click functionality - Reverted to call navigateToSection
const pawn = document.getElementById('personal-pawn');

if (pawn) {
    pawn.addEventListener('click', function(event) {
        event.preventDefault();
        const section = this.dataset.section;
        if (section) {
            navigateToSection(section);
        }
    });
}

// Authentication handling (moved to a function to be called after loading content)
function attachAuthFormListener() {
    const authForm = document.getElementById('auth-form');
    const personalInfo = document.querySelector('.personal-info');
    const sensitiveContent = document.querySelector('.sensitive-content');

    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('auth-password').value;

            // Replace 'your-secure-password' with your actual password
            if (password === 'your-secure-password') {
                personalInfo.classList.remove('hidden');
                sensitiveContent.classList.add('authenticated');
                authForm.classList.add('hidden');
                 // Add your personal information here
                sensitiveContent.innerHTML = '<p>This is my super sensitive personal information that only I should see!</p>';

            } else {
                alert('Incorrect password. This is Wanjohi\'s personal page.');
            }
        });
    }
}

// Add animation to elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.skill-card, .project-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial check for elements in view
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Add initial styles for animation
document.querySelectorAll('.skill-card, .project-card').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Animation handling for home section
function handleHomeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Update the navigateToSection function
function navigateToSection(sectionId) {
    console.log(`Attempting to navigate to section: ${sectionId}`);
    const chessBoard = document.querySelector('.chess-board');
    const sectionContentDiv = document.getElementById('section-content');
    const contentContainer = document.querySelector('.content-container');

    // Hide the chess board
    if (chessBoard) {
        chessBoard.classList.add('hidden');
    }

    // Show the content container
    if (contentContainer) {
        contentContainer.style.display = 'block';
    }

    // Load content from the corresponding HTML file
    const sectionFile = `${sectionId}.html`;
    console.log(`Fetching ${sectionFile}...`);
    fetch(sectionFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(`${sectionFile} fetched successfully.`);
            return response.text();
        })
        .then(html => {
            sectionContentDiv.innerHTML = html; // Inject the HTML
            // Explicitly show the section content div after injecting HTML
            sectionContentDiv.style.display = 'block';
            console.log(`${sectionFile} content loaded into div.`);

            // Initialize animations and side nav if it's the home section
            if (sectionId === 'home') {
                // Delay initialization slightly to ensure DOM is ready after injection
                 setTimeout(() => {
                    attachHeroHoverEffect(); // Keep existing hero effect
                 }, 50);
            } else {
                // For other pages loaded dynamically, ensure side nav is initialized
                // and the body class for the curve is added
                 setTimeout(() => {
                     document.body.classList.add('side-nav-open');
                 }, 50);
            }

             // Note: For other pages accessed directly, side nav initialization happens via DOMContentLoaded listener

        })
        .catch(error => console.error(`Error loading ${sectionFile}:`, error));
}

// Function to attach hover effect to hero section elements
function attachHeroHoverEffect() {
    const heroSection = document.querySelector('.hero-section .container');
    
    if (!heroSection) {
        console.log('Hero section container not found.');
        return;
    }

    const animatedElements = heroSection.querySelectorAll('h1, p, .hero-buttons');
    const sensitivity = 5; // Adjust sensitivity for the effect

    heroSection.addEventListener('mousemove', function(e) {
        const { offsetX, offsetY } = e;
        const { clientWidth, clientHeight } = heroSection;

        const centerX = clientWidth / 2;
        const centerY = clientHeight / 2;

        const moveX = (offsetX - centerX) / centerX * sensitivity;
        const moveY = (offsetY - centerY) / centerY * sensitivity;

        animatedElements.forEach(element => {
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            element.style.transition = 'transform 0.1s ease-out'; // Smooth transition
        });
    });

    heroSection.addEventListener('mouseleave', function() {
        animatedElements.forEach(element => {
            element.style.transform = 'translate(0, 0)';
            element.style.transition = 'transform 0.3s ease-out'; // Smooth reset transition
        });
    });
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Toggle Project Details on Projects Page
document.querySelectorAll('.see-more-button').forEach(button => {
    button.addEventListener('click', () => {
        const projectCard = button.closest('.project-card');
        if (projectCard) {
            projectCard.classList.toggle('active');
            if (projectCard.classList.contains('active')) {
                button.textContent = 'Show Less';
            } else {
                button.textContent = 'See More';
            }
        }
    });
});

// Handle Project Gallery Image Clicks
document.querySelectorAll('.project-gallery img').forEach(image => {
    image.addEventListener('click', () => {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const captionText = document.getElementById('caption');

        modal.style.display = 'block';
        modalImage.src = image.src;
        // You can set captionText.innerHTML based on an alt attribute or data attribute on the image if you like
        captionText.innerHTML = image.alt;
    });
});

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];

// When the user clicks on <span> (x), close the modal
if (span) {
    span.onclick = function() {
        const modal = document.getElementById('imageModal');
        modal.style.display = 'none';
    }
}

// Close the modal when clicking outside the modal content
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Skill Modal Functionality
const skillDetails = {
    web: {
        title: "Web Development",
        details: `
            <h3>Frontend Development</h3>
            <ul>
                <li>HTML5 - Clean and structured web pages</li>
                <li>CSS3 - Responsive design, layouts and animations</li>
                <li>JavaScript - Interactive features and modern syntax and frameworks</li>
            </ul>
            <h3>Backend Development</h3>
            <ul>
                <li>Laravel (PHP) – Web applications with built-in authentication and routing</li>
                <li>Django (Python) – Fast, secure backend development</li>
                <li>Node.js</li>
            </ul>
        `
    },
    database: {
        title: "Database Administration",
        details: `
            <h3>Database Management Systems</h3>
            <ul>
                <li>MySQL - Database design and optimization</li>
                <li>PostgreSQL - Advanced features and performance tuning</li>
            </ul>
            <h3>Skills</h3>
            <ul>
                <li>Database design and normalization</li>
                <li>Query optimization and performance tuning</li>
                <li>Data backup and recovery</li>
                <li>Security implementation</li>
            </ul>
        `
    },
    security: {
        title: "Information Security",
        details: `
            <h3>Security Frameworks</h3>
            <ul>
                <li>NIST Cybersecurity Framework</li>
                <li>OWASP Top 10</li>
                <li>ISO 27001</li>
            </ul>
            <h3>Security Practices</h3>
            <ul>
                <li>Vulnerability assessment and penetration testing</li>
                <li>Security policy development</li>
                <li>Incident response and recovery</li>
                <li>Security awareness training</li>
            </ul>
        `
    }
};

// Get modal elements
const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalTitle');
const modalDetails = document.getElementById('modalDetails');
const closeModal = document.querySelector('.close-modal');

// Add click event to all skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('click', () => {
        const skillType = card.getAttribute('data-skill');
        const skill = skillDetails[skillType];
        
        modalTitle.textContent = skill.title;
        modalDetails.innerHTML = skill.details;
        modal.style.display = 'block';
    });
});

// Close modal when clicking the close button
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// Chess game logic
let selectedPiece = null;
let currentPlayer = 'white';

function getValidMoves(piece, row, col) {
    const pieceType = piece.dataset.piece;
    const pieceColor = piece.dataset.color;
    const moves = [];

    switch(pieceType) {
        case 'pawn':
            // Pawns move forward one square, or two squares from starting position
            const direction = pieceColor === 'white' ? -1 : 1;
            const startRow = pieceColor === 'white' ? 6 : 1;
            
            // Forward move
            if (!getPieceAt(row + direction, col)) {
                moves.push([row + direction, col]);
                // Two squares from start
                if (row === startRow && !getPieceAt(row + 2 * direction, col)) {
                    moves.push([row + 2 * direction, col]);
                }
            }
            
            // Capture moves
            [-1, 1].forEach(offset => {
                const targetPiece = getPieceAt(row + direction, col + offset);
                if (targetPiece && targetPiece.dataset.color !== pieceColor) {
                    moves.push([row + direction, col + offset]);
                }
            });
            break;

        case 'rook':
            // Rooks move horizontally and vertically
            for (let i = 0; i < 8; i++) {
                if (i !== col) moves.push([row, i]); // Horizontal
                if (i !== row) moves.push([i, col]); // Vertical
            }
            break;

        case 'knight':
            // Knights move in L-shape
            const knightMoves = [
                [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                [1, -2], [1, 2], [2, -1], [2, 1]
            ];
            knightMoves.forEach(([rowOffset, colOffset]) => {
                const newRow = row + rowOffset;
                const newCol = col + colOffset;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    const targetPiece = getPieceAt(newRow, newCol);
                    if (!targetPiece || targetPiece.dataset.color !== pieceColor) {
                        moves.push([newRow, newCol]);
                    }
                }
            });
            break;

        case 'bishop':
            // Bishops move diagonally
            for (let i = 0; i < 8; i++) {
                if (i !== 0) {
                    moves.push([row + i, col + i]); // Diagonal down-right
                    moves.push([row + i, col - i]); // Diagonal down-left
                    moves.push([row - i, col + i]); // Diagonal up-right
                    moves.push([row - i, col - i]); // Diagonal up-left
                }
            }
            break;

        case 'queen':
            // Queens move like rooks and bishops combined
            // Horizontal and vertical
            for (let i = 0; i < 8; i++) {
                if (i !== col) moves.push([row, i]);
                if (i !== row) moves.push([i, col]);
            }
            // Diagonal
            for (let i = 0; i < 8; i++) {
                if (i !== 0) {
                    moves.push([row + i, col + i]);
                    moves.push([row + i, col - i]);
                    moves.push([row - i, col + i]);
                    moves.push([row - i, col - i]);
                }
            }
            break;

        case 'king':
            // Kings move one square in any direction
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                        const targetPiece = getPieceAt(newRow, newCol);
                        if (!targetPiece || targetPiece.dataset.color !== pieceColor) {
                            moves.push([newRow, newCol]);
                        }
                    }
                }
            }
            break;
    }

    return moves.filter(([newRow, newCol]) => {
        return newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8;
    });
}

function getPieceAt(row, col) {
    const square = document.querySelector(`.board-square[data-row="${row}"][data-col="${col}"]`);
    return square ? square.querySelector('i') : null;
}

function highlightValidMoves(moves) {
    moves.forEach(([row, col]) => {
        const square = document.querySelector(`.board-square[data-row="${row}"][data-col="${col}"]`);
        if (square) {
            square.classList.add('valid-move');
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('.valid-move').forEach(square => {
        square.classList.remove('valid-move');
    });
}

function movePiece(fromRow, fromCol, toRow, toCol) {
    const fromSquare = document.querySelector(`.board-square[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`.board-square[data-row="${toRow}"][data-col="${toCol}"]`);
    const piece = fromSquare.querySelector('i');
    
    // Remove any existing piece at destination
    const existingPiece = toSquare.querySelector('i');
    if (existingPiece) {
        existingPiece.remove();
    }
    
    // Move the piece
    toSquare.appendChild(piece);
    
    // Switch turns
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
}

// Add click handlers to the chess board
document.addEventListener('DOMContentLoaded', () => {
    const chessBoard = document.getElementById('chessBoard');
    if (chessBoard) {
        chessBoard.addEventListener('click', (e) => {
            const square = e.target.closest('.board-square');
            if (!square) return;

            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const piece = square.querySelector('i');

            if (selectedPiece) {
                // If a piece is already selected, try to move it
                const fromRow = parseInt(selectedPiece.parentElement.dataset.row);
                const fromCol = parseInt(selectedPiece.parentElement.dataset.col);
                
                if (square.classList.contains('valid-move')) {
                    movePiece(fromRow, fromCol, row, col);
                    clearHighlights();
                    selectedPiece = null;
                } else {
                    // If clicking on a different piece of the same color, select that piece instead
                    if (piece && piece.dataset.color === currentPlayer) {
                        clearHighlights();
                        selectedPiece = piece;
                        const moves = getValidMoves(piece, row, col);
                        highlightValidMoves(moves);
                    } else {
                        clearHighlights();
                        selectedPiece = null;
                    }
                }
            } else if (piece && piece.dataset.color === currentPlayer) {
                // Select a piece
                selectedPiece = piece;
                const moves = getValidMoves(piece, row, col);
                highlightValidMoves(moves);
            }
        });
    }
});