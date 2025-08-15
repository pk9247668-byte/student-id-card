// Student ID Card Management System - JavaScript

class StudentManagementSystem {
    constructor() {
        // Initialize data from provided JSON
        this.schools = [
            {
                id: "school_1",
                name: "Greenwood High School",
                studentsCount: 25,
                totalFormsNeeded: 50,
                registrationLink: "school_1",
                createdDate: "2025-08-15"
            },
            {
                id: "school_2", 
                name: "St. Mary's Academy",
                studentsCount: 18,
                totalFormsNeeded: 40,
                registrationLink: "school_2",
                createdDate: "2025-08-14"
            }
        ];

        this.students = [
            {
                serialNo: "STU001",
                name: "John Smith",
                fatherName: "Robert Smith",
                motherName: "Mary Smith",
                class: "10",
                roll: "15",
                section: "A",
                dateOfBirth: "2009-05-15",
                address: "123 Main Street, City",
                mobileNo: "9876543210",
                photo: "STU001.jpg",
                schoolId: "school_1",
                submittedDate: "2025-08-15T10:30:00Z"
            },
            {
                serialNo: "STU002",
                name: "Sarah Johnson",
                fatherName: "David Johnson", 
                motherName: "Lisa Johnson",
                class: "9",
                roll: "22",
                section: "B",
                dateOfBirth: "2010-03-22",
                address: "456 Oak Avenue, City",
                mobileNo: "9876543211",
                photo: "STU002.jpg",
                schoolId: "school_1",
                submittedDate: "2025-08-15T11:15:00Z"
            }
        ];

        this.currentSchoolId = null;
        this.currentPhotoFile = null;
        this.schoolToDelete = null;

        this.init();
    }

    init() {
        // Ensure modal is hidden on initialization
        this.ensureModalHidden();
        this.bindEvents();
        this.updateDashboard();
        this.checkURLParams();
    }

    ensureModalHidden() {
        const modal = document.getElementById('delete-modal');
        const loadingOverlay = document.getElementById('loading-overlay');
        
        if (modal) {
            modal.classList.add('hidden');
        }
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        // Reset any form states
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.add('hidden');
        }
    }

    bindEvents() {
        // Dashboard events
        const addSchoolForm = document.getElementById('add-school-form');
        const exportAllBtn = document.getElementById('export-all-btn');
        
        if (addSchoolForm) {
            addSchoolForm.addEventListener('submit', (e) => this.handleAddSchool(e));
        }
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllData());
        }

        // Form events
        const backToDashboard = document.getElementById('back-to-dashboard');
        const studentForm = document.getElementById('student-form');
        const continueBtn = document.getElementById('continue-btn');
        
        if (backToDashboard) {
            backToDashboard.addEventListener('click', () => this.showDashboard());
        }
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => this.handleStudentSubmit(e));
        }
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.resetForm());
        }

        // Photo upload events
        const photoUpload = document.getElementById('photo-upload');
        const photoInput = document.getElementById('photo-input');
        const removePhoto = document.getElementById('remove-photo');
        
        if (photoUpload) {
            photoUpload.addEventListener('click', () => this.triggerPhotoUpload());
            // Photo upload drag and drop
            photoUpload.addEventListener('dragover', (e) => this.handleDragOver(e));
            photoUpload.addEventListener('drop', (e) => this.handlePhotoDrop(e));
        }
        if (photoInput) {
            photoInput.addEventListener('change', (e) => this.handlePhotoSelect(e));
        }
        if (removePhoto) {
            removePhoto.addEventListener('click', () => this.removePhoto());
        }

        // Modal events
        const modalClose = document.getElementById('modal-close');
        const cancelDelete = document.getElementById('cancel-delete');
        const confirmDelete = document.getElementById('confirm-delete');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => this.closeModal());
        }
        if (confirmDelete) {
            confirmDelete.addEventListener('click', () => this.confirmDelete());
        }

        // Form validation events
        const mobileInput = document.getElementById('mobile');
        const serialInput = document.getElementById('serial-no');
        
        if (mobileInput) {
            mobileInput.addEventListener('input', (e) => this.validateMobile(e));
        }
        if (serialInput) {
            serialInput.addEventListener('input', (e) => this.validateSerialNo(e));
        }

        // Update form progress
        const formInputs = document.querySelectorAll('#student-form input, #student-form select, #student-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.updateFormProgress());
        });

        // Global escape key handler for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Click outside modal to close
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    checkURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const schoolId = urlParams.get('school');
        
        if (schoolId && this.schools.find(s => s.id === schoolId)) {
            this.currentSchoolId = schoolId;
            this.showSchoolForm(schoolId);
        }
    }

    showDashboard() {
        document.getElementById('admin-dashboard').classList.add('active');
        document.getElementById('school-form').classList.remove('active');
        this.updateDashboard();
        
        // Update URL
        window.history.pushState({}, '', window.location.pathname);
    }

    showSchoolForm(schoolId) {
        const school = this.schools.find(s => s.id === schoolId);
        if (!school) return;

        this.currentSchoolId = schoolId;
        document.getElementById('admin-dashboard').classList.remove('active');
        document.getElementById('school-form').classList.add('active');
        document.getElementById('school-form-title').textContent = `${school.name} - Student Registration`;
        
        // Update URL
        window.history.pushState({}, '', `?school=${schoolId}`);
        
        this.resetForm();
    }

    updateDashboard() {
        // Update statistics
        document.getElementById('total-schools').textContent = this.schools.length;
        document.getElementById('total-students').textContent = this.students.length;
        
        const totalFormsNeeded = this.schools.reduce((sum, school) => sum + school.totalFormsNeeded, 0);
        const pendingForms = totalFormsNeeded - this.students.length;
        document.getElementById('pending-forms').textContent = pendingForms;

        // Update schools grid
        this.renderSchools();
    }

    renderSchools() {
        const grid = document.getElementById('schools-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        this.schools.forEach(school => {
            const studentsCount = this.students.filter(s => s.schoolId === school.id).length;
            const progress = school.totalFormsNeeded > 0 ? (studentsCount / school.totalFormsNeeded) * 100 : 0;
            const registrationUrl = `${window.location.origin}${window.location.pathname}?school=${school.id}`;

            const schoolCard = document.createElement('div');
            schoolCard.className = 'school-card';
            schoolCard.innerHTML = `
                <div class="school-card__header">
                    <h3 class="school-card__title">${school.name}</h3>
                </div>
                
                <div class="school-card__stats">
                    <div class="school-stat">
                        <h4 class="school-stat__number">${studentsCount}</h4>
                        <p class="school-stat__label">Students Registered</p>
                    </div>
                    <div class="school-stat">
                        <h4 class="school-stat__number">${school.totalFormsNeeded}</h4>
                        <p class="school-stat__label">Total Required</p>
                    </div>
                </div>

                <div class="progress-container">
                    <div class="progress-label">
                        <span>Progress</span>
                        <span>${progress.toFixed(1)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="school-card__link">
                    <strong>Registration Link:</strong><br>
                    <span style="font-size: var(--font-size-xs);">${registrationUrl}</span>
                </div>

                <div class="school-card__actions">
                    <button class="btn btn--outline btn--sm" onclick="app.openSchoolForm('${school.id}')">
                        View Form
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="app.downloadSchoolData('${school.id}')">
                        Download Data
                    </button>
                    <button class="btn btn--outline btn--sm" onclick="app.copyLink('${registrationUrl}')">
                        Copy Link
                    </button>
                    <button class="btn btn--outline btn--sm" style="color: var(--color-error);" onclick="app.deleteSchool('${school.id}')">
                        Delete
                    </button>
                </div>
            `;
            grid.appendChild(schoolCard);
        });
    }

    handleAddSchool(e) {
        e.preventDefault();
        const schoolNameInput = document.getElementById('school-name');
        if (!schoolNameInput) return;
        
        const schoolName = schoolNameInput.value.trim();
        
        if (!schoolName) {
            this.showNotification('Please enter a school name', 'error');
            return;
        }

        const newSchool = {
            id: `school_${Date.now()}`,
            name: schoolName,
            studentsCount: 0,
            totalFormsNeeded: 50, // Default value
            registrationLink: `school_${Date.now()}`,
            createdDate: new Date().toISOString().split('T')[0]
        };

        this.schools.push(newSchool);
        this.updateDashboard();
        
        // Reset form
        schoolNameInput.value = '';
        
        // Show success message
        this.showNotification('School added successfully!', 'success');
    }

    openSchoolForm(schoolId) {
        this.showSchoolForm(schoolId);
    }

    deleteSchool(schoolId) {
        this.schoolToDelete = schoolId;
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    confirmDelete() {
        if (this.schoolToDelete) {
            // Remove school
            this.schools = this.schools.filter(s => s.id !== this.schoolToDelete);
            // Remove students
            this.students = this.students.filter(s => s.schoolId !== this.schoolToDelete);
            
            this.updateDashboard();
            this.closeModal();
            this.showNotification('School deleted successfully!', 'success');
        }
    }

    closeModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.schoolToDelete = null;
    }

    copyLink(url) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopyToClipboard(url);
            });
        } else {
            this.fallbackCopyToClipboard(url);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            this.showNotification('Link copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy link. Please copy manually.', 'error');
        }
        document.body.removeChild(textArea);
    }

    downloadSchoolData(schoolId) {
        const school = this.schools.find(s => s.id === schoolId);
        const schoolStudents = this.students.filter(s => s.schoolId === schoolId);
        
        if (!school) {
            this.showNotification('School not found', 'error');
            return;
        }

        if (schoolStudents.length === 0) {
            this.showNotification('No student data available for this school', 'error');
            return;
        }

        const csvContent = this.generateCSV(schoolStudents);
        this.downloadCSV(csvContent, `${school.name}_students.csv`);
    }

    exportAllData() {
        if (this.students.length === 0) {
            this.showNotification('No student data available to export', 'error');
            return;
        }

        const csvContent = this.generateCSV(this.students);
        this.downloadCSV(csvContent, 'all_students_data.csv');
    }

    generateCSV(students) {
        const headers = [
            'Serial No', 'Name', 'Father Name', 'Mother Name', 'Class', 
            'Roll', 'Section', 'Date of Birth', 'Address', 'Mobile No', 
            'Photo File', 'School', 'Submitted Date'
        ];

        const rows = students.map(student => {
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
                new Date(student.submittedDate).toLocaleString()
            ];
        });

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        return csvContent;
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification(`Downloaded ${filename}`, 'success');
        } else {
            this.showNotification('Download not supported in this browser', 'error');
        }
    }

    handleStudentSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        this.showLoading();

        // Simulate API call
        setTimeout(() => {
            const formData = this.getFormData();
            
            // Check for duplicate serial number
            if (this.students.find(s => s.serialNo === formData.serialNo && s.schoolId === this.currentSchoolId)) {
                this.hideLoading();
                this.showNotification('Serial number already exists for this school!', 'error');
                return;
            }

            // Add student
            const newStudent = {
                ...formData,
                schoolId: this.currentSchoolId,
                submittedDate: new Date().toISOString()
            };

            this.students.push(newStudent);
            
            // Update school student count
            const school = this.schools.find(s => s.id === this.currentSchoolId);
            if (school) {
                school.studentsCount = this.students.filter(s => s.schoolId === this.currentSchoolId).length;
            }

            this.hideLoading();
            this.showSuccessMessage();
        }, 1500);
    }

    validateForm() {
        const requiredFields = [
            'serial-no', 'student-name', 'father-name', 'mother-name',
            'class', 'roll', 'section', 'dob', 'address', 'mobile'
        ];

        let isValid = true;

        // Check required fields
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });

        // Check photo
        if (!this.currentPhotoFile) {
            this.showNotification('Please upload a student photo', 'error');
            isValid = false;
        }

        // Validate mobile number
        const mobileField = document.getElementById('mobile');
        if (mobileField) {
            const mobile = mobileField.value;
            if (!/^\d{10}$/.test(mobile)) {
                mobileField.style.borderColor = 'var(--color-error)';
                this.showNotification('Please enter a valid 10-digit mobile number', 'error');
                isValid = false;
            }
        }

        if (!isValid) {
            this.showNotification('Please fill all required fields correctly', 'error');
        }

        return isValid;
    }

    getFormData() {
        const getValue = (id) => {
            const element = document.getElementById(id);
            return element ? element.value.trim() : '';
        };

        return {
            serialNo: getValue('serial-no'),
            name: getValue('student-name'),
            fatherName: getValue('father-name'),
            motherName: getValue('mother-name'),
            class: getValue('class'),
            roll: getValue('roll'),
            section: getValue('section'),
            dateOfBirth: getValue('dob'),
            address: getValue('address'),
            mobileNo: getValue('mobile'),
            photo: `${getValue('serial-no')}.jpg`
        };
    }

    resetForm() {
        const form = document.getElementById('student-form');
        if (form) {
            form.reset();
        }
        
        this.currentPhotoFile = null;
        this.hideSuccessMessage();
        this.updateFormProgress();
        
        // Reset photo upload
        const photoPreview = document.getElementById('photo-preview');
        const photoUploadArea = document.getElementById('photo-upload');
        
        if (photoPreview) {
            photoPreview.classList.add('hidden');
        }
        if (photoUploadArea) {
            const uploadArea = photoUploadArea.querySelector('.photo-upload__area');
            if (uploadArea) {
                uploadArea.style.display = 'block';
            }
        }
        
        // Reset field styles
        const formInputs = document.querySelectorAll('#student-form input, #student-form select, #student-form textarea');
        formInputs.forEach(input => {
            input.style.borderColor = '';
        });
    }

    showSuccessMessage() {
        const form = document.getElementById('student-form');
        const successMessage = document.getElementById('success-message');
        
        if (form) form.style.display = 'none';
        if (successMessage) successMessage.classList.remove('hidden');
    }

    hideSuccessMessage() {
        const form = document.getElementById('student-form');
        const successMessage = document.getElementById('success-message');
        
        if (form) form.style.display = 'block';
        if (successMessage) successMessage.classList.add('hidden');
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const submitBtn = document.getElementById('submit-btn');
        
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        if (submitBtn) submitBtn.classList.add('btn--loading');
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const submitBtn = document.getElementById('submit-btn');
        
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (submitBtn) submitBtn.classList.remove('btn--loading');
    }

    triggerPhotoUpload() {
        const photoInput = document.getElementById('photo-input');
        if (photoInput) {
            photoInput.click();
        }
    }

    handlePhotoSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processPhotoFile(file);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    handlePhotoDrop(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processPhotoFile(files[0]);
        }
    }

    processPhotoFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('Image size should be less than 5MB', 'error');
            return;
        }

        this.currentPhotoFile = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImage = document.getElementById('preview-image');
            const photoPreview = document.getElementById('photo-preview');
            const photoUpload = document.getElementById('photo-upload');
            
            if (previewImage) previewImage.src = e.target.result;
            if (photoPreview) photoPreview.classList.remove('hidden');
            if (photoUpload) {
                const uploadArea = photoUpload.querySelector('.photo-upload__area');
                if (uploadArea) uploadArea.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);

        this.updateFormProgress();
    }

    removePhoto() {
        this.currentPhotoFile = null;
        
        const photoPreview = document.getElementById('photo-preview');
        const photoUpload = document.getElementById('photo-upload');
        const photoInput = document.getElementById('photo-input');
        
        if (photoPreview) photoPreview.classList.add('hidden');
        if (photoUpload) {
            const uploadArea = photoUpload.querySelector('.photo-upload__area');
            if (uploadArea) uploadArea.style.display = 'block';
        }
        if (photoInput) photoInput.value = '';
        
        this.updateFormProgress();
    }

    updateFormProgress() {
        const formInputs = document.querySelectorAll('#student-form input, #student-form select, #student-form textarea');
        let filledFields = 0;
        let totalFields = formInputs.length;

        formInputs.forEach(input => {
            if (input.value && input.value.trim()) {
                filledFields++;
            }
        });

        // Add photo to progress
        if (this.currentPhotoFile) {
            filledFields++;
        }
        totalFields++; // Add photo field to total

        const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
        const progressFill = document.getElementById('form-progress');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    validateMobile(e) {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value.slice(0, 10);
        e.target.style.borderColor = '';
    }

    validateSerialNo(e) {
        const value = e.target.value.toUpperCase();
        e.target.value = value;
        e.target.style.borderColor = '';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span>${message}</span>
                <button class="notification__close">×</button>
            </div>
        `;

        // Add styles
        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            background: ${bgColor};
            color: white;
            font-weight: 500;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
        `;

        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification__content { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
                .notification__close { background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; }
                .notification__close:hover { opacity: 0.8; }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);

        // Remove on click
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StudentManagementSystem();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.app) {
            window.app = new StudentManagementSystem();
        }
    });
} else {
    window.app = new StudentManagementSystem();
}