// **NOTE:** You MUST change this path to the correct location of your PDF file.
// The file must be accessible relative to index.html (e.g., 'Group_B_Proposal.pdf' or 'files/proposal.pdf').
const PROPOSAL_PDF_PATH = 'https://udksa-my.sharepoint.com/:b:/g/personal/2210009122_iau_edu_sa/EfZnAhQyUJhNi_k71oFilhIBj63yzAp6TddztnS6yyYCKQ?e=G6Pz0ns'; // تم تعديل المسار ليتناسب مع الرابط الثابت في HTML

// بيانات الجدول الزمني من مواصفات المشروع (Data from Project Specifications)
const timelineData = [
    {
        week: 1,
        date: "September 30, 2025",
        title: "Project Introduction",
        tasks: ["Understand Project Scope", "Receive Initial Code and Data"],
        submission: "None",
        marks: 0,
        status: "complete",
        files: []
    },
    {
        week: 2,
        date: "October 7, 2025",
        title: "Project Setup & Proposal Presentation",
        tasks: ["Setup PyCharm environment", "Prepare 5-minute presentation"],
        submission: "Proposal PDF",
        marks: 1,
        status: "current",
        files: ["Proposal PDF"]
    },
    {
        week: 3,
        date: "October 14, 2025",
        title: "Core Code - Data Extraction",
        tasks: ["Modify core script to log vehicle detections"],
        submission: "extract_data.py and raw_detections.csv",
        marks: 0,
        status: "pending",
        files: ["extract_data.py", "raw_detections.csv"]
    },
    {
        week: 4,
        date: "October 21, 2025",
        title: "Core Logic Implementation",
        tasks: ["Implement vehicle speed estimation system"],
        submission: "speed_estimation.py and demo video",
        marks: 2,
        status: "pending",
        files: ["speed_estimation.py", "demo_video.mp4", "vehicle_speeds.csv"]
    },
    {
        week: 5,
        date: "October 28, 2025",
        title: "Final Dataset Generation",
        tasks: ["Process raw data to create final clean dataset"],
        submission: "data_generation.py and final_dataset.csv",
        marks: 0,
        status: "pending",
        files: ["data_generation.py", "final_dataset.csv"]
    },
    {
        week: 6,
        date: "November 4, 2025",
        title: "Data Analysis and Visualization",
        tasks: ["Analyze speed distribution", "Create graphical charts"],
        submission: "Run.py and chart images (.png)",
        marks: 2,
        status: "pending",
        files: ["data_analysis.py", "speed_histogram.png", "speed_boxplot.png"]
    },
    {
        week: 7,
        date: "November 11, 2025",
        title: "Report Writing",
        tasks: ["Draft the formal technical report"],
        submission: "Group_B_Report_Draft.pdf",
        marks: 0,
        status: "pending",
        files: ["Group_B_Report_Draft.pdf"]
    },
    {
        week: 8,
        date: "November 18, 2025",
        title: "Project Finalization and Submission",
        tasks: ["Finalize report", "Clean and comment code", "Assemble files"],
        submission: "TTENG564_Project_Group_B.zip",
        marks: 4,
        status: "pending",
        files: ["TTENG564_Project_Group_B.zip"]
    },
    {
        week: 9,
        date: "November 25, 2025",
        title: "Final Presentation",
        tasks: ["Create slides deck", "Deliver final presentation"],
        submission: "Group_B_Final_Presentation.pptx",
        marks: 2,
        status: "pending",
        files: ["Group_B_Final_Presentation.pptx"]
    }
];

// حالة التطبيق (Application State)
let uploadedFiles = [];
let uploadedPresentations = [];
let fileTree = {};
let currentFile = null;
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let timerDuration = 5; // in minutes
let currentZoom = 100;
let currentWeek = 2; // لتحديد الأسبوع الحالي في لوجيك عرض الملفات

// قوالب الكود (Code Templates)
const codeTemplates = {
    'extract_data.py': `import cv2
import pandas as pd
from ultralytics import YOLO
import numpy as np
// ... (rest of code templates) ...
`,
    'speed_estimation.py': `import cv2
import numpy as np
import pandas as pd
from collections import defaultdict
import math
// ... (rest of code templates) ...
`,
    'data_analysis.py': `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
// ... (rest of code templates) ...
`
};

// بيانات الملفات والمجلدات النموذجية (Sample File and Folder Data)
const sampleFileTree = {
    // Current Week: Files are available
    "Week_2_Proposal": {
        type: "folder",
        files: {
            "Group_B_Proposal.pdf": {
                type: "document",
                size: "1.2 MB",
                date: "2025-10-07",
                week: 2, // إضافة رقم الأسبوع
                // path: PROPOSAL_PDF_PATH, // هذا كان للمسار الداخلي
                url: PROPOSAL_PDF_PATH, // تحديث لاستخدام المسار الثابت
                content: "Proposal document reference."
            }
        }
    },

    // Future Weeks' Files
    "Week_3_Data_Extraction": {
        type: "folder",
        files: {
            "extract_data.py": {
                type: "code",
                size: "4.2 KB",
                date: "2025-10-14",
                week: 3,
                content: codeTemplates['extract_data.py']
            },
            "raw_detections.csv": {
                type: "spreadsheet",
                size: "125 KB",
                date: "2025-10-14",
                week: 3,
                content: "Dummy CSV data for raw detections."
            },
            "sample_output.png": {
                type: "image",
                size: "890 KB",
                date: "2025-10-14",
                week: 3,
                content: "Dummy image data."
            }
        }
    },

    "Week_4_Speed_Estimation": {
        type: "folder",
        files: {
            "speed_estimation.py": {
                type: "code",
                size: "6.8 KB",
                date: "2025-10-21",
                week: 4,
                content: codeTemplates['speed_estimation.py']
            },
            "demo_video.mp4": {
                type: "video",
                size: "15.2 MB",
                date: "2025-10-21",
                week: 4,
                content: "Dummy video data."
            },
            "vehicle_speeds.csv": {
                type: "spreadsheet",
                size: "45 KB",
                date: "2025-10-21",
                week: 4,
                content: "Dummy CSV data for vehicle speeds."
            }
        }
    },

    "Week_6_Analysis": {
        type: "folder",
        files: {
            "data_analysis.py": {
                type: "code",
                size: "8.1 KB",
                date: "2025-11-04",
                week: 6,
                content: codeTemplates['data_analysis.py']
            },
            "speed_histogram.png": {
                type: "image",
                size: "245 KB",
                date: "2025-11-04",
                week: 6,
                content: "Dummy image data for histogram."
            },
            "speed_boxplot.png": {
                type: "image",
                size: "198 KB",
                date: "2025-11-04",
                week: 6,
                content: "Dummy image data for boxplot."
            }
        }
    },

    "Week_7_Report_Draft": {
        type: "folder",
        files: {
            "Group_B_Report_Draft.pdf": {
                type: "document",
                size: "950 KB",
                date: "2025-11-11",
                week: 7,
                content: "Technical Report Draft Content."
            }
        }
    },

    "Week_9_Presentation": {
        type: "folder",
        files: {
            "Group_B_Final_Presentation.pptx": {
                type: "presentation",
                size: "5.5 MB",
                date: "2025-11-25",
                week: 9,
                content: "Final Presentation Slides."
            }
        }
    }
};


// تهيئة التطبيق (Application Initialization)
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Starting Application Initialization...');

    initializeNavigation();
    generateTimeline();
    initializeFileUpload();
    initializeFileManager(); // تم تعديلها في الأسفل
    initializeTimer(); // تم تعديلها في الأسفل
    setupEventListeners();
    // تم حذف setupModalEvents لعدم وجود Modal

    fileTree = { ...sampleFileTree };
    // لا يتم استدعاء renderFileTree هنا، بل يتم ذلك فقط بعد الوصول لصفحة الملفات

    // Auto-load the Proposal link
    initializeProposalLink();

    // إخفاء مؤشرات التقدم غير الضرورية في Home
    initializeProgressBar();

    console.log('✅ Application Initialized Successfully');
    console.log('💡 PROPOSAL PDF PATH is set to:', PROPOSAL_PDF_PATH);
});

// وظائف التنقل (Navigation Functions) - (Unchanged logic)
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.dataset.section;

            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            this.classList.add('active');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');

                if (targetSection === 'files') {
                    // عرض شجرة الملفات عند الانتقال لصفحة الملفات
                    setTimeout(() => renderFileTree(), 100);
                }

                showNotification(`Mapped to ${getSectionName(targetSection)} section`, 'info');
            } else {
                console.error('❌ Section not found:', targetSection);
                showNotification('Navigation Error - Section not found', 'error');
            }
        });
    });
}

function getSectionName(sectionId) {
    const names = {
        'home': 'Home',
        'proposal': 'Proposal',
        'progress': 'Progress',
        'files': 'Files & Code',
        'reports': 'Reports',
        'presentations': 'Presentations',
        'team': 'Team' // *تمت إضافة القسم الجديد*
    };
    return names[sectionId] || sectionId;
}

// إنشاء الجدول الزمني (Generate Timeline) - (Unchanged logic)
function generateTimeline() {
    const timelineContainer = document.getElementById('timeline');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = '';

    const currentWeekIndex = timelineData.findIndex(item => item.status === 'current');

    timelineData.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';

        const markerClass = `timeline-marker ${item.status}`;
        const tasksText = item.tasks.join(', ');
        const marksText = item.marks > 0 ? `${item.marks} Marks` : 'No Marks';

        let submissionText = item.submission;

        // Logic for "Coming Soon" file paths
        if (index > currentWeekIndex) {
            submissionText = "Files: Coming Soon ⏳";
            if (item.files && item.files.length > 0) {
                submissionText = `Files: ${item.files.join(', ')} (Available on ${item.date}) ⏳`;
            } else {
                submissionText = `Submission: ${item.submission} (Coming Soon) ⏳`;
            }
        } else {
            submissionText = `Submission: ${item.submission}`;
        }

        timelineItem.innerHTML = `
            <div class="${markerClass}"></div>
            <div class="timeline-content">
                <div class="timeline-week">Week ${item.week} - ${item.date}</div>
                <div class="timeline-title">${item.title}</div>
                <div class="timeline-tasks">Tasks: ${tasksText}</div>
                <div class="timeline-submission">${submissionText}</div>
                <div class="timeline-marks">${marksText}</div>
            </div>
        `;

        timelineContainer.appendChild(timelineItem);
    });
}

// تهيئة رفع الملفات العام (Initialize General File Upload) - (Modified: Keep it simple)
function initializeFileUpload() {
    console.log('🚫 File Upload areas are disabled as requested.');
    const generalUploadArea = document.getElementById('generalUploadArea');
    if (generalUploadArea) {
        generalUploadArea.addEventListener('click', () => {
            showNotification('Access all files via the "Files & Code" section!', 'info');
        });
    }
}

// **NEW FUNCTION**: Initialize the Proposal Link
function initializeProposalLink() {
    const proposalLink = document.querySelector('#proposal .proposal-actions a');
    if (proposalLink && PROPOSAL_PDF_PATH) {
        // تعيين الرابط الثابت للملف
        proposalLink.href = PROPOSAL_PDF_PATH;
    }
}


// **MODIFIED**: تهيئة مدير الملفات - تعطيل جميع الوظائف باستثناء التبديل بين طرق العرض
function initializeFileManager() {
    const fileSearch = document.getElementById('fileSearch');
    const viewButtons = document.querySelectorAll('.view-btn');

    // File search is disabled in HTML
    if (fileSearch) {
        fileSearch.addEventListener('input', function (e) {
            // filterFiles(e.target.value); // Removed functionality
        });
    }

    // View buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const view = this.dataset.view;
            switchFileView(view);
        });
    });

    // Removed setupFileManagerActions as all actions are disabled/removed

    // إخفاء الـ file-content و file-search والـ file-content actions إذا لم تكن في الأسبوع الثالث بعد
    const fileContent = document.querySelector('#files .file-content');
    const fileSidebar = document.querySelector('#files .file-sidebar');

    if (currentWeek < 3) {
        // لا داعي للإخفاء لأن الـ placeholder يحل محل الـ fileTree في HTML
        // يمكننا تعطيل البحث
        if (fileSearch) fileSearch.disabled = true;
    }
}


// عرض شجرة الملفات (Render File Tree) - (Modified to check for future weeks)
function renderFileTree() {
    const treeContainer = document.getElementById('fileTree');
    if (!treeContainer) return;

    treeContainer.innerHTML = '';
    let filesAvailable = false;

    // استخراج أسماء المجلدات وترتيبها رقميًا حسب الأسبوع
    const sortedFolderNames = Object.keys(fileTree).sort((a, b) => {
        const weekA = parseInt(a.match(/Week_(\d+)/)?.[1] || 0);
        const weekB = parseInt(b.match(/Week_(\d+)/)?.[1] || 0);
        return weekA - weekB;
    });

    sortedFolderNames.forEach(folderName => {
        const folder = fileTree[folderName];
        // افتراض: رقم الأسبوع هو آخر كلمة في اسم المجلد
        const folderWeek = parseInt(folderName.match(/Week_(\d+)/)?.[1] || 0);

        if (folderWeek <= currentWeek) {
            const folderElement = createFolderElement(folderName, folder);
            treeContainer.appendChild(folderElement);
            filesAvailable = true;
        } else {
            // إضافة عنصر "قادم قريباً" للمجلدات المستقبلية
            const comingSoonElement = document.createElement('div');
            comingSoonElement.className = 'folder disabled';
            comingSoonElement.innerHTML = `
                <div class="folder-header" style="color: var(--text-muted); cursor: default;">
                    📁 ${folderName} (🔒 Week ${folderWeek})
                </div>
            `;
            treeContainer.appendChild(comingSoonElement);
        }
    });

    // إذا لم تكن هناك ملفات متاحة في الوقت الحالي (أي لم يتم الوصول للأسبوع الثالث بعد)
    if (!filesAvailable && currentWeek < 3) {
        treeContainer.innerHTML = `
            <div class="placeholder-content p-20 text-center">
                <div class="placeholder-icon">⏳</div>
                <h3>File Access Coming Soon</h3>
                <p>Project files and code will be available here starting from **Week 3** (October 14, 2025).</p>
            </div>
        `;
    }

    // إذا كان الأسبوع الحالي هو الأسبوع الثاني، يجب أن تكون ملفات الأسبوع الثاني متاحة، لذلك filesAvailable ستكون true.
    // يجب إظهار محتوى Week 2 حتى لو لم يتم الوصول لـ Week 3
    if (filesAvailable && treeContainer.innerHTML.includes('File Access Coming Soon')) {
        // إعادة عرض الشجرة لضمان ظهور الملفات المتاحة
        treeContainer.innerHTML = '';
        sortedFolderNames.forEach(folderName => {
            const folder = fileTree[folderName];
            const folderWeek = parseInt(folderName.match(/Week_(\d+)/)?.[1] || 0);

            if (folderWeek <= currentWeek) {
                const folderElement = createFolderElement(folderName, folder);
                treeContainer.appendChild(folderElement);
            } else {
                const comingSoonElement = document.createElement('div');
                comingSoonElement.className = 'folder disabled';
                comingSoonElement.innerHTML = `
                    <div class="folder-header" style="color: var(--text-muted); cursor: default;">
                        📁 ${folderName} (🔒 Week ${folderWeek})
                    </div>
                `;
                treeContainer.appendChild(comingSoonElement);
            }
        });
    }
}

// إنشاء عنصر مجلد (Create Folder Element) - (Modified to disable file clicks)
function createFolderElement(name, folder) {
    const folderDiv = document.createElement('div');
    folderDiv.className = 'folder';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'folder-header';
    headerDiv.textContent = `📁 ${name}`;
    headerDiv.addEventListener('click', () => toggleFolder(folderDiv));

    const contentDiv = document.createElement('div');
    contentDiv.className = 'folder-content';

    if (folder.files) {
        // Sort files alphabetically
        const fileNames = Object.keys(folder.files).sort((a, b) => a.localeCompare(b));
        fileNames.forEach(fileName => {
            const file = folder.files[fileName];
            let fileStatus = '';

            // تحقق بسيط من توفر الملف بناءً على رقم الأسبوع في البيانات
            if (file.week > currentWeek) {
                fileStatus = ` (🔒 Week ${file.week})`;
                file.disabled = true; // Mark file as disabled for clicks
            } else {
                file.disabled = false;
            }

            // تم تعديل وظيفة createFileElement
            const fileElement = createFileElement(fileName, file, fileStatus);
            contentDiv.appendChild(fileElement);
        });
    }

    folderDiv.appendChild(headerDiv);
    folderDiv.appendChild(contentDiv);

    return folderDiv;
}

// إنشاء عنصر ملف (Create File Element) - (Modified: Disabled functionality)
function createFileElement(name, file, status = '') {
    const fileDiv = document.createElement('div');
    fileDiv.className = 'file';

    // إضافة فئة disabled إذا كان الملف غير متاح
    if (file.disabled || file.week > currentWeek) {
        fileDiv.classList.add('disabled');
        fileDiv.title = `File ${name} is not yet available. Coming on Week ${file.week}`;
    }

    fileDiv.textContent = `${getFileIcon(name)} ${name}${status}`;

    // إضافة معالج الحدث عند النقر على الملف
    fileDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetWeek = file.week || 0;

        // التحقق من أن الملف متاح وأن له رابط (URL)
        if (!file.disabled && targetWeek <= currentWeek) {
            if (file.url) {
                // فتح الرابط في نافذة جديدة
                window.open(file.url, '_blank');
                showNotification(`Opening file: ${name} in a new tab.`, 'info');
            } else {
                // الإبقاء على وظيفة الإشعار التحذيري لملفات الكود/التي ليس لها رابط مباشر
                showNotification(`File selected: ${name}. File viewing/editing is currently disabled.`, 'warning');
            }
        } else {
            showNotification(`File ${name} is not yet available. Coming on Week ${targetWeek}.`, 'warning');
        }
    });

    return fileDiv;
}


// **MODIFIED**: تهيئة المؤقت - إزالة وظيفة المؤقت بالكامل
function initializeTimer() {
    const timerControls = document.querySelector('.practice-timer .card__body');
    if (timerControls) {
        timerControls.innerHTML = `
            <div class="placeholder-content p-20">
                <div class="placeholder-icon">⏱️</div>
                <h3>Practice Timer Coming Soon</h3>
                <p>Presentation practice tools will be available closer to the submission dates.</p>
            </div>
        `;
    }
}

// ... (Unchanged helper functions: toggleFolder, getFileIcon, showNotification, initializeProgressBar, switchFileView, filterFiles)
// ... (All viewer/editor functions (showCodeEditor, showVideoPlayer, showSpreadsheetViewer, etc.) are removed as they are no longer needed/used)
// ... (The only remaining logic from the original viewer functions is to show a placeholder in file-content)

function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
        case 'pdf':
            return '📄';
        case 'py':
            return '🐍';
        case 'csv':
        case 'xlsx':
            return '📊';
        case 'mp4':
        case 'avi':
            return '📹';
        case 'png':
        case 'jpg':
        case 'jpeg':
            return '🖼️';
        case 'pptx':
        case 'ppt':
            return '🎯';
        default:
            return '🗄️';
    }
}

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In a real application, this would show a visible toast/notification
}

function initializeProgressBar() {
    // Logic remains to animate the progress bar on load
}

function toggleFolder(folderDiv) {
    const content = folderDiv.querySelector('.folder-content');
    if (content) {
        content.classList.toggle('hidden');
    }
}

function switchFileView(view) {
    const fileTree = document.getElementById('fileTree');
    if (fileTree) {
        fileTree.className = `file-tree ${view}-view`;
        showNotification(`Switched to ${view} view (Visual change only)`, 'info');
    }
}

function filterFiles(query) {
    // Search functionality is disabled now.
}

function setupEventListeners() {
    // Event listeners for proposal section buttons (now just a single link)
    const proposalLink = document.querySelector('#proposal .proposal-actions a');
    if (proposalLink) {
        proposalLink.addEventListener('click', (e) => {
            showNotification('Opening Proposal PDF in a new tab...', 'info');
        });
    }

    // Set up button event listeners that are still in HTML
    document.querySelectorAll('.btn').forEach(button => {
        if (button.textContent.includes('Start Work')) {
            button.addEventListener('click', () => showNotification('Starting work on the next milestone...', 'info'));
        }
    });

    // Disable all buttons in Presentations section
    document.querySelectorAll('#presentations .btn').forEach(btn => {
        // لا نحتاج لتعطيل زر View Proposal الآن لأنه رابط مباشر
        if (btn.textContent.includes('Practice')) {
            btn.disabled = true;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const week = 'Week 9';
                showNotification(`This feature is disabled. Practice tools will be available in ${week}.`, 'warning');
            });
        }
        // أزرار الـ Upload تم حذفها من HTML
    });

    // Disable report buttons
    document.querySelectorAll('#reports .btn').forEach(btn => {
        btn.disabled = true;
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const week = btn.textContent.includes('Report (Coming Week 7)') ? 'Week 7' : 'Week 4';
            showNotification(`This feature is disabled. Report access will be available in ${week}.`, 'warning');
        });
    });

    // Disable file manager action buttons (though they are hidden in HTML now)
    document.querySelectorAll('.file-manager .btn').forEach(btn => btn.disabled = true);
    document.querySelector('#fileSearch').disabled = true;
}

// Remaining helper function that was kept minimal
function initializeProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = '15%'; // Ensure it starts at 15%
    }
}