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
        // Ensure all modals are hidden initially
        this.closeAllModals();
        this.setupEventListeners();
        this.determineView();
        this.updateStats();
    }

    setupEventListeners() {
        // Admin Dashboard Events
        const addSchoolForm = document.getElementById('addSchoolForm');
        if (addSchoolForm) {
            addSchoolForm.addEventListener('submit', (e) => this.handleAddSchool(e));
        }

        const downloadBtn = document.getElementById('downloadDataBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadData());
        }

        // Student Form Events
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => this.handleStudentSubmit(e));
        }

        const resetFormBtn = document.getElementById('resetFormBtn');
        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => this.resetStudentForm());
        }

        const photoInput = document.getElementById('photo');
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
        }

        const removePhotoBtn = document.getElementById('removePhoto');
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', () => this.removePhoto());
        }

        // Modal Events
        this.setupModalEvents();

        // Mobile number validation
        const mobileInput = document.getElementById('mobileNo');
        if (mobileInput) {
            mobileInput.addEventListener('input', (e) => this.validateMobileNumber(e));
        }
    }

    setupModalEvents() {
        // School Link Modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeSchoolLinkModal());
        }

        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => this.copyLink());
        }

        // Delete Modal
        const closeDeleteModal = document.getElementById('closeDeleteModal');
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => this.closeDeleteModal());
        }

        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        }

        const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
        }

        // Close modals on backdrop click
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    determineView() {
        const urlParams = new URLSearchParams(window.location.search);
        const schoolParam = urlParams.get('school');

        if (schoolParam) {
            // School form view
            this.currentSchoolId = schoolParam;
            const school = this.schools.find(s => s.registrationLink === schoolParam);
            
            if (school) {
                this.showSchoolForm(school);
            } else {
                this.showError('Invalid school link');
            }
        } else {
            // Admin dashboard view
            this.showAdminDashboard();
        }
    }

    showAdminDashboard() {
        this.currentView = 'admin';
        document.getElementById('adminDashboard').classList.remove('hidden');
        document.getElementById('schoolForm').classList.add('hidden');
        this.renderSchoolsList();
        this.updateStats();
    }

    showSchoolForm(school) {
        this.currentView = 'school';
        document.getElementById('adminDashboard').classList.add('hidden');
        document.getElementById('schoolForm').classList.remove('hidden');
        
        const formTitle = document.getElementById('schoolFormTitle');
        if (formTitle) {
            formTitle.textContent = `${school.name} - Student Registration`;
        }

        this.setNextSerialNumber();
    }

    handleAddSchool(e) {
        e.preventDefault();
        
        const schoolNameInput = document.getElementById('schoolName');
        const schoolName = schoolNameInput.value.trim();
        
        if (!schoolName) return;

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
            this.renderSchoolsList();
            this.updateStats();
            
            schoolNameInput.value = '';
            this.hideLoadingButton('addSchoolBtnText', 'addSchoolLoader');
            
            // Show link modal
            this.showSchoolLinkModal(registrationLink);
        }, 1000);
    }

    showSchoolLinkModal(registrationLink) {
        const modal = document.getElementById('schoolLinkModal');
        const linkInput = document.getElementById('generatedLink');
        
        const fullLink = `${window.location.origin}${window.location.pathname}?school=${registrationLink}`;
        linkInput.value = fullLink;
        
        modal.classList.remove('hidden');
    }

    closeSchoolLinkModal() {
        document.getElementById('schoolLinkModal').classList.add('hidden');
    }

    copyLink() {
        const linkInput = document.getElementById('generatedLink');
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        
        try {
            navigator.clipboard.writeText(linkInput.value).then(() => {
                const copyBtn = document.getElementById('copyLinkBtn');
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = 'var(--color-success)';
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = '';
                }, 2000);
            });
        } catch (err) {
            // Fallback for older browsers
            document.execCommand('copy');
            alert('Link copied to clipboard!');
        }
    }

    renderSchoolsList() {
        const schoolsList = document.getElementById('schoolsList');
        
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
                    <button class="btn btn--sm btn--outline" style="color: var(--color-error); border-color: var(--color-error);" data-action="deleteSchool" data-school-id="${school.id}">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the dynamically created buttons
        this.attachSchoolActionListeners();
    }

    attachSchoolActionListeners() {
        const schoolsList = document.getElementById('schoolsList');
        if (!schoolsList) return;

        schoolsList.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-action]');
            if (!button) return;

            const action = button.dataset.action;
            
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
        const fullLink = `${window.location.origin}${window.location.pathname}?school=${registrationLink}`;
        
        try {
            navigator.clipboard.writeText(fullLink).then(() => {
                this.showToast('School link copied to clipboard!');
            });
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = fullLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('School link copied to clipboard!');
        }
    }

    showDeleteModal(schoolId) {
        this.deleteSchoolId = schoolId;
        const school = this.schools.find(s => s.id === schoolId);
        document.getElementById('deleteModal').classList.remove('hidden');
    }

    closeDeleteModal() {
        this.deleteSchoolId = null;
        document.getElementById('deleteModal').classList.add('hidden');
    }

    confirmDelete() {
        if (!this.deleteSchoolId) return;

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
        const totalSchoolsEl = document.getElementById('totalSchools');
        const totalStudentsEl = document.getElementById('totalStudents');
        
        if (totalSchoolsEl) totalSchoolsEl.textContent = this.schools.length;
        if (totalStudentsEl) totalStudentsEl.textContent = this.students.length;
    }

    downloadData() {
        if (this.students.length === 0) {
            alert('No student data available to download.');
            return;
        }

        const csvData = this.generateCSV(this.students);
        this.downloadCSV(csvData, 'all_students_data.csv');
    }

    downloadSchoolData(schoolId) {
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
        }
    }

    showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: var(--shadow-md);
            animation: slideInRight 0.3s ease-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
        this.deleteSchoolId = null;
    }

    showError(message) {
        alert(`Error: ${message}`);
        // Redirect to main page
        window.location.href = window.location.pathname;
    }
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new StudentDataSystem();
    // Make app globally available immediately
    window.app = app;
});