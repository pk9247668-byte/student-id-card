// Student ID Card Data Collection System - JavaScript

class StudentDataSystem {
    constructor() {
        // Initialize with provided data
        this.schools = [
            {
                "id": "school_001",
                "name": "Green Valley School",
                "studentsCount": 12,
                "registrationLink": "school_001",
                "createdDate": "2025-08-15"
            },
            {
                "id": "school_002", 
                "name": "Sunrise Academy",
                "studentsCount": 8,
                "registrationLink": "school_002",
                "createdDate": "2025-08-15"
            }
        ];

        this.students = [
            {
                "serialNo": "01",
                "name": "Arjun Patel",
                "fatherName": "Raj Patel",
                "motherName": "Priya Patel",
                "class": "10",
                "roll": "15",
                "section": "A",
                "dateOfBirth": "2009-05-15",
                "address": "123 Main Street, Mumbai",
                "mobileNo": "9876543210",
                "photo": "01.jpg",
                "schoolId": "school_001",
                "submittedDate": "2025-08-15T10:30:00Z"
            },
            {
                "serialNo": "02",
                "name": "Sneha Sharma",
                "fatherName": "Vikash Sharma", 
                "motherName": "Meera Sharma",
                "class": "9",
                "roll": "22",
                "section": "B",
                "dateOfBirth": "2010-03-22",
                "address": "456 Park Road, Delhi",
                "mobileNo": "9876543211",
                "photo": "02.jpg",
                "schoolId": "school_001",
                "submittedDate": "2025-08-15T11:15:00Z"
            }
        ];

        this.currentView = 'admin';
        this.currentSchoolId = null;
        this.deleteSchoolId = null;
    }

    init() {
        console.log('Initializing Student Data System...');
        
        // Critical fix: Force hide all modals first
        this.forceHideAllModals();
        this.determineView();
        this.setupEventListeners();
        
        console.log('Current view:', this.currentView);
        console.log('Schools:', this.schools.length);
        console.log('Students:', this.students.length);
    }

    forceHideAllModals() {
        // Critical fix: Forcefully hide all modals on initialization
        const allModals = document.querySelectorAll('.modal');
        allModals.forEach(modal => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        });
        
        // Reset any modal state variables
        this.deleteSchoolId = null;
    }

    determineView() {
        const urlParams = new URLSearchParams(window.location.search);
        const schoolParam = urlParams.get('school');

        console.log('URL school parameter:', schoolParam);

        if (schoolParam) {
            // School form view - CLEAN interface with NO admin functions
            this.currentSchoolId = schoolParam;
            const school = this.schools.find(s => s.registrationLink === schoolParam);
            
            console.log('Found school:', school);
            
            if (school) {
                this.showSchoolForm(school);
            } else {
                console.error('School not found for link:', schoolParam);
                this.showError('Invalid school link');
            }
        } else {
            // Admin dashboard view
            this.showAdminDashboard();
        }
    }

    showAdminDashboard() {
        console.log('Showing admin dashboard');
        this.currentView = 'admin';
        
        const adminDashboard = document.getElementById('adminDashboard');
        const schoolForm = document.getElementById('schoolForm');
        
        if (adminDashboard) adminDashboard.classList.remove('hidden');
        if (schoolForm) schoolForm.classList.add('hidden');
        
        // Ensure modals remain hidden
        this.forceHideAllModals();
        
        this.renderSchoolsList();
        this.updateStats();
    }

    showSchoolForm(school) {
        console.log('Showing school form for:', school.name);
        this.currentView = 'school';
        
        const adminDashboard = document.getElementById('adminDashboard');
        const schoolForm = document.getElementById('schoolForm');
        
        if (adminDashboard) adminDashboard.classList.add('hidden');
        if (schoolForm) schoolForm.classList.remove('hidden');
        
        // Critical fix: Completely remove admin modals from school view
        this.hideAdminModalsInSchoolView();
        
        const formTitle = document.getElementById('schoolFormTitle');
        if (formTitle) {
            formTitle.textContent = `${school.name} - Student Registration`;
        }

        this.setNextSerialNumber();
    }

    hideAdminModalsInSchoolView() {
        // Critical fix: Hide admin modals from school view
        const adminModals = ['schoolLinkModal', 'deleteModal'];
        adminModals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                modal.classList.add('hidden');
            }
        });
    }

    setupEventListeners() {
        console.log('Setting up event listeners for view:', this.currentView);
        
        // Setup school form event listeners (always available)
        this.setupSchoolFormEventListeners();
        
        // Only setup admin event listeners if in admin view
        if (this.currentView === 'admin') {
            this.setupAdminEventListeners();
        }
    }

    setupAdminEventListeners() {
        console.log('Setting up admin event listeners');
        
        // Admin Dashboard Events
        const addSchoolForm = document.getElementById('addSchoolForm');
        if (addSchoolForm) {
            addSchoolForm.addEventListener('submit', (e) => {
                console.log('Add school form submitted');
                this.handleAddSchool(e);
            });
        }

        const downloadBtn = document.getElementById('downloadDataBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                console.log('Download data clicked');
                this.downloadData();
            });
        }

        // Modal Events - ONLY for admin view
        this.setupAdminModalEvents();
    }

    setupSchoolFormEventListeners() {
        console.log('Setting up school form event listeners');
        
        // Student Form Events
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => {
                console.log('Student form submitted');
                this.handleStudentSubmit(e);
            });
        }

        const resetFormBtn = document.getElementById('resetFormBtn');
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                console.log('Reset form clicked');
                this.resetStudentForm();
            });
        }

        const photoInput = document.getElementById('photo');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        const removePhotoBtn = document.getElementById('removePhoto');
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => this.removePhoto());
        }

        // Mobile number validation
        const mobileInput = document.getElementById('mobileNo');
        if (mobileInput) {
            mobileInput.addEventListener('input', (e) => this.validateMobileNumber(e));
        }
    }

    setupAdminModalEvents() {
        // Critical fix: ONLY setup modal events in admin view
        if (this.currentView !== 'admin') return;

        console.log('Setting up admin modal events');

        // School Link Modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeSchoolLinkModal();
            });
        }

        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyLink();
            });
        }

        // Delete Modal
        const closeDeleteModal = document.getElementById('closeDeleteModal');
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDeleteModal();
            });
        }

        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.confirmDelete();
            });
        }

        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeDeleteModal();
            });
        }

        // ESC key to close modals - ONLY in admin view
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentView === 'admin') {
                e.preventDefault();
                this.closeAllModals();
            }
        });
    }

    handleAddSchool(e) {
        e.preventDefault();
        console.log('Handling add school...');
        
        const schoolNameInput = document.getElementById('schoolName');
        const schoolName = schoolNameInput.value.trim();
        
        if (!schoolName) {
            alert('Please enter a school name');
            return;
        }

        console.log('Adding school:', schoolName);
        this.showLoadingButton('addSchoolBtnText', 'addSchoolLoader');

        // Simulate API call
        setTimeout(() => {
            const schoolId = `school_${Date.now()}`;
            const registrationLink = schoolId;
            
            const newSchool = {
                id: schoolId,
                name: schoolName,
                studentsCount: 0,
                registrationLink: registrationLink,
                createdDate: new Date().toISOString().split('T')[0]
            };

            this.schools.push(newSchool);
            console.log('School added:', newSchool);
            
            this.renderSchoolsList();
            this.updateStats();
            
            schoolNameInput.value = '';
            this.hideLoadingButton('addSchoolBtnText', 'addSchoolLoader');
            
            // Show link modal - ONLY in admin view
            if (this.currentView === 'admin') {
                this.showSchoolLinkModal(registrationLink);
            }
        }, 1000);
    }

    showSchoolLinkModal(registrationLink) {
        // Critical fix: ONLY show modal in admin view and ensure it exists
        if (this.currentView !== 'admin') return;
        
        console.log('Showing school link modal for:', registrationLink);
        
        const modal = document.getElementById('schoolLinkModal');
        const linkInput = document.getElementById('generatedLink');
        
        if (!modal || !linkInput) {
            console.error('Modal elements not found');
            return;
        }
        
        const fullLink = `${window.location.origin}${window.location.pathname}?school=${registrationLink}`;
        linkInput.value = fullLink;
        
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        
        console.log('Modal shown with link:', fullLink);
    }

    closeSchoolLinkModal() {
        console.log('Closing school link modal');
        const modal = document.getElementById('schoolLinkModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }

    copyLink() {
        console.log('Copying link...');
        const linkInput = document.getElementById('generatedLink');
        if (!linkInput) return;
        
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(linkInput.value).then(() => {
                console.log('Link copied successfully');
                const copyBtn = document.getElementById('copyLinkBtn');
                if (copyBtn) {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.background = 'var(--color-success)';
                    
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = '';
                    }, 2000);
                }
            }).catch(() => {
                this.fallbackCopyToClipboard(linkInput.value);
            });
        } catch (err) {
            this.fallbackCopyToClipboard(linkInput.value);
        }
    }

    fallbackCopyToClipboard(text) {
        console.log('Using fallback copy method');
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy link. Please copy it manually.');
        }
        
        document.body.removeChild(textArea);
    }

    renderSchoolsList() {
        console.log('Rendering schools list');
        const schoolsList = document.getElementById('schoolsList');
        if (!schoolsList) {
            console.error('Schools list element not found');
            return;
        }
        
        if (this.schools.length === 0) {
            schoolsList.innerHTML = '<div class="empty-state"><p>No schools added yet. Add a school to get started.</p></div>';
            return;
        }

        schoolsList.innerHTML = this.schools.map(school => `
            <div class="school-item">
                <div class="school-info">
                    <h4>${school.name}</h4>
                    <div class="school-meta">
                        <span><strong>Students:</strong> ${school.studentsCount}</span>
                        <span><strong>Created:</strong> ${new Date(school.createdDate).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="school-actions">
                    <button class="btn btn--sm btn--outline" data-action="copyLink" data-school-link="${school.registrationLink}">
                        Copy Link
                    </button>
                    <button class="btn btn--sm btn--primary" data-action="downloadData" data-school-id="${school.id}">
                        Download Data
                    </button>
                    <button class="btn btn--sm btn--outline btn--delete" data-action="deleteSchool" data-school-id="${school.id}">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the dynamically created buttons
        this.attachSchoolActionListeners();
        console.log('Schools list rendered with', this.schools.length, 'schools');
    }

    attachSchoolActionListeners() {
        const schoolsList = document.getElementById('schoolsList');
        if (!schoolsList || this.currentView !== 'admin') return;

        console.log('Attaching school action listeners');

        schoolsList.addEventListener('click', (e) => {
            e.preventDefault();
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            console.log('School action clicked:', action);
            
            switch(action) {
                case 'copyLink':
                    this.copySchoolLink(button.dataset.schoolLink);
                    break;
                case 'downloadData':
                    this.downloadSchoolData(button.dataset.schoolId);
                    break;
                case 'deleteSchool':
                    this.showDeleteModal(button.dataset.schoolId);
                    break;
            }
        });
    }

    copySchoolLink(registrationLink) {
        console.log('Copying school link for:', registrationLink);
        const fullLink = `${window.location.origin}${window.location.pathname}?school=${registrationLink}`;
        
        try {
            navigator.clipboard.writeText(fullLink).then(() => {
                console.log('School link copied successfully');
                this.showToast('School link copied to clipboard!');
            }).catch(() => {
                this.fallbackCopyToClipboard(fullLink);
            });
        } catch (err) {
            this.fallbackCopyToClipboard(fullLink);
        }
    }

    showDeleteModal(schoolId) {
        // Critical fix: ONLY show delete modal in admin view
        if (this.currentView !== 'admin') return;
        
        console.log('Showing delete modal for school:', schoolId);
        this.deleteSchoolId = schoolId;
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
    }

    closeDeleteModal() {
        console.log('Closing delete modal');
        this.deleteSchoolId = null;
        const modal = document.getElementById('deleteModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        }
    }

    confirmDelete() {
        if (!this.deleteSchoolId || this.currentView !== 'admin') return;

        console.log('Confirming delete for school:', this.deleteSchoolId);

        // Remove school and its students
        this.schools = this.schools.filter(s => s.id !== this.deleteSchoolId);
        this.students = this.students.filter(s => s.schoolId !== this.deleteSchoolId);
        
        this.renderSchoolsList();
        this.updateStats();
        this.closeDeleteModal();
        this.showToast('School deleted successfully');
    }

    setNextSerialNumber() {
        const schoolStudents = this.students.filter(s => s.schoolId === this.currentSchoolId);
        const nextSerialNumber = String(schoolStudents.length + 1).padStart(2, '0');
        
        console.log('Setting next serial number:', nextSerialNumber);
        
        const serialInput = document.getElementById('serialNo');
        if (serialInput) {
            serialInput.value = nextSerialNumber;
        }

        // Update photo filename display
        this.updatePhotoFilename(nextSerialNumber);
    }

    updatePhotoFilename(serialNo) {
        const savedFilename = document.getElementById('savedFilename');
        if (savedFilename) {
            savedFilename.textContent = `${serialNo}.jpg`;
        }
    }

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) {
            this.hidePhotoPreview();
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            e.target.value = '';
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Please select an image smaller than 5MB.');
            e.target.value = '';
            return;
        }

        // Show preview
        this.showPhotoPreview(file);
        
        // Show filename display
        const photoFilename = document.getElementById('photoFilename');
        if (photoFilename) {
            photoFilename.classList.remove('hidden');
        }
    }

    showPhotoPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('previewImg');
            const photoPreview = document.getElementById('photoPreview');
            const photoFileName = document.getElementById('photoFileName');
            
            if (previewImg && photoPreview && photoFileName) {
                previewImg.src = e.target.result;
                photoFileName.textContent = `Original: ${file.name}`;
                photoPreview.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(file);
    }

    hidePhotoPreview() {
        const photoPreview = document.getElementById('photoPreview');
        const photoFilename = document.getElementById('photoFilename');
        
        if (photoPreview) photoPreview.classList.add('hidden');
        if (photoFilename) photoFilename.classList.add('hidden');
    }

    removePhoto() {
        const photoInput = document.getElementById('photo');
        if (photoInput) {
            photoInput.value = '';
        }
        this.hidePhotoPreview();
    }

    validateMobileNumber(e) {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value.slice(0, 10);
    }

    handleStudentSubmit(e) {
        e.preventDefault();
        console.log('Handling student submit...');
        
        if (!this.validateForm()) return;

        this.showLoadingButton('submitBtnText', 'submitLoader');

        // Simulate API call
        setTimeout(() => {
            const formData = new FormData(e.target);
            const serialNo = formData.get('serialNo');
            
            const studentData = {
                serialNo: serialNo,
                name: formData.get('studentName'),
                fatherName: formData.get('fatherName'),
                motherName: formData.get('motherName'),
                class: formData.get('class'),
                roll: formData.get('roll'),
                section: formData.get('section'),
                dateOfBirth: formData.get('dateOfBirth'),
                address: formData.get('address'),
                mobileNo: formData.get('mobileNo'),
                photo: `${serialNo}.jpg`,
                schoolId: this.currentSchoolId,
                submittedDate: new Date().toISOString()
            };

            this.students.push(studentData);
            console.log('Student added:', studentData);
            
            // Update school student count
            const school = this.schools.find(s => s.id === this.currentSchoolId);
            if (school) {
                school.studentsCount++;
            }

            this.hideLoadingButton('submitBtnText', 'submitLoader');
            this.showSuccessMessage();
            this.resetStudentForm();
            this.setNextSerialNumber();
        }, 1500);
    }

    validateForm() {
        const requiredFields = [
            'studentName', 'fatherName', 'motherName', 'class', 
            'roll', 'section', 'dateOfBirth', 'address', 'mobileNo', 'photo'
        ];

        let isValid = true;
        
        for (const fieldName of requiredFields) {
            const field = document.getElementById(fieldName);
            if (!field || !field.value.trim()) {
                field?.focus();
                alert(`Please fill in the ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                isValid = false;
                break;
            }
        }

        // Validate mobile number
        const mobileField = document.getElementById('mobileNo');
        if (mobileField && mobileField.value.length !== 10) {
            mobileField.focus();
            alert('Please enter a valid 10-digit mobile number.');
            isValid = false;
        }

        return isValid;
    }

    resetStudentForm() {
        const form = document.getElementById('studentForm');
        if (form) {
            form.reset();
        }
        this.hidePhotoPreview();
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 3000);
        }
    }

    showLoadingButton(textElementId, loaderElementId) {
        const textEl = document.getElementById(textElementId);
        const loaderEl = document.getElementById(loaderElementId);
        
        if (textEl) textEl.classList.add('hidden');
        if (loaderEl) loaderEl.classList.remove('hidden');
    }

    hideLoadingButton(textElementId, loaderElementId) {
        const textEl = document.getElementById(textElementId);
        const loaderEl = document.getElementById(loaderElementId);
        
        if (textEl) textEl.classList.remove('hidden');
        if (loaderEl) loaderEl.classList.add('hidden');
    }

    updateStats() {
        // Fixed: Show only Total Schools and Total Students (removed Total Required)
        const totalSchoolsEl = document.getElementById('totalSchools');
        const totalStudentsEl = document.getElementById('totalStudents');
        
        if (totalSchoolsEl) totalSchoolsEl.textContent = this.schools.length;
        if (totalStudentsEl) totalStudentsEl.textContent = this.students.length;
        
        console.log('Stats updated - Schools:', this.schools.length, 'Students:', this.students.length);
    }

    downloadData() {
        console.log('Downloading all data...');
        if (this.students.length === 0) {
            alert('No student data available to download.');
            return;
        }

        const csvData = this.generateCSV(this.students);
        this.downloadCSV(csvData, 'all_students_data.csv');
    }

    downloadSchoolData(schoolId) {
        console.log('Downloading school data for:', schoolId);
        const schoolStudents = this.students.filter(s => s.schoolId === schoolId);
        const school = this.schools.find(s => s.id === schoolId);
        
        if (schoolStudents.length === 0) {
            alert('No student data available for this school.');
            return;
        }

        const csvData = this.generateCSV(schoolStudents);
        const filename = `${school ? school.name.replace(/\s+/g, '_') : 'school'}_students_data.csv`;
        this.downloadCSV(csvData, filename);
    }

    generateCSV(studentsData) {
        const headers = [
            'Serial No', 'Name', 'Father Name', 'Mother Name', 'Class', 'Roll', 
            'Section', 'Date of Birth', 'Address', 'Mobile No', 'Photo', 'School', 'Submitted Date'
        ];

        const rows = studentsData.map(student => {
            const school = this.schools.find(s => s.id === student.schoolId);
            return [
                student.serialNo,
                student.name,
                student.fatherName,
                student.motherName,
                student.class,
                student.roll,
                student.section,
                student.dateOfBirth,
                student.address,
                student.mobileNo,
                student.photo,
                school ? school.name : 'Unknown',
                new Date(student.submittedDate).toLocaleDateString()
            ];
        });

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        return csvContent;
    }

    downloadCSV(csvData, filename) {
        console.log('Downloading CSV:', filename);
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showToast(`Downloaded ${filename}`);
        }
    }

    showToast(message) {
        console.log('Showing toast:', message);
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    closeAllModals() {
        // Critical fix: Force hide all modals properly
        const allModals = document.querySelectorAll('.modal');
        allModals.forEach(modal => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
        });
        this.deleteSchoolId = null;
    }

    showError(message) {
        alert(`Error: ${message}`);
        // Redirect to main page
        window.location.href = window.location.pathname;
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing app...');
    app = new StudentDataSystem();
    app.init();
    // Make app globally available
    window.app = app;
});