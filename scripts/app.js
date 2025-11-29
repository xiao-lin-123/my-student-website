// 学习反馈管理系统 - 交互逻辑

class LearningFeedbackSystem {
    constructor() {
        this.currentRole = 'student'; // 默认为学生视角
        this.currentView = 'my-homework';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateRoleDisplay();
        this.showView(this.currentView);
    }

    // 绑定所有事件监听器
    bindEvents() {
        // 用户菜单相关
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.getElementById('userDropdown');
        const switchRole = document.getElementById('switchRole');

        // 导航链接
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.getAttribute('data-view');
                this.switchView(view);
            });
        });

        // 模态框相关
        const askQuestionBtn = document.getElementById('askQuestionBtn');
        const createHomeworkBtn = document.getElementById('createHomeworkBtn');
        const questionModal = document.getElementById('questionModal');
        const homeworkModal = document.getElementById('homeworkModal');
        const closeModal = document.getElementById('closeModal');
        const closeHomeworkModal = document.getElementById('closeHomeworkModal');
        const cancelQuestion = document.getElementById('cancelQuestion');
        const cancelHomework = document.getElementById('cancelHomework');

        // 表单提交
        const questionForm = document.getElementById('questionForm');
        const homeworkForm = document.getElementById('homeworkForm');

        // 过滤器标签
        const tabBtns = document.querySelectorAll('.tab-btn');

        // 事件绑定
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', () => this.toggleUserDropdown());
        }

        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                userDropdown?.classList.remove('show');
            }
        });

        if (switchRole) {
            switchRole.addEventListener('click', () => this.switchRole());
        }

        if (askQuestionBtn) {
            askQuestionBtn.addEventListener('click', () => this.openQuestionModal());
        }

        if (createHomeworkBtn) {
            createHomeworkBtn.addEventListener('click', () => this.openHomeworkModal());
        }

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal('questionModal'));
        }

        if (closeHomeworkModal) {
            closeHomeworkModal.addEventListener('click', () => this.closeModal('homeworkModal'));
        }

        if (cancelQuestion) {
            cancelQuestion.addEventListener('click', () => this.closeModal('questionModal'));
        }

        if (cancelHomework) {
            cancelHomework.addEventListener('click', () => this.closeModal('homeworkModal'));
        }

        // 点击模态框外部关闭
        [questionModal, homeworkModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.closeModal(modal.id);
                    }
                });
            }
        });

        if (questionForm) {
            questionForm.addEventListener('submit', (e) => this.handleQuestionSubmit(e));
        }

        if (homeworkForm) {
            homeworkForm.addEventListener('submit', (e) => this.handleHomeworkSubmit(e));
        }

        // 标签切换
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const status = e.target.getAttribute('data-status');
                this.filterQuestions(status);
            });
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // 响应式处理
        this.handleResponsive();
    }

    // 切换角色（学生/教师）
    switchRole() {
        this.currentRole = this.currentRole === 'student' ? 'teacher' : 'student';
        this.updateRoleDisplay();
        
        // 关闭下拉菜单
        const userDropdown = document.getElementById('userDropdown');
        userDropdown?.classList.remove('show');

        // 根据角色显示对应视图
        if (this.currentRole === 'teacher' && this.currentView === 'my-homework') {
            this.switchView('homework-management');
        } else if (this.currentRole === 'student' && 
                   ['homework-management', 'student-qa', 'class-list'].includes(this.currentView)) {
            this.switchView('my-homework');
        }
    }

    // 更新角色显示
    updateRoleDisplay() {
        const userName = document.getElementById('userName');
        const switchRoleBtn = document.getElementById('switchRole');
        const navLinks = document.querySelectorAll('.nav-link');
        const teacherOnlyLinks = document.querySelectorAll('.teacher-only');
        const currentRoleSpan = document.querySelector('.current-role');

        if (this.currentRole === 'student') {
            if (userName) userName.textContent = '张三同学';
            if (switchRoleBtn) switchRoleBtn.textContent = '切换为教师视图';
            if (currentRoleSpan) currentRoleSpan.textContent = '当前身份：学生';
            
            // 显示学生导航，隐藏教师导航
            navLinks.forEach(link => {
                if (!link.classList.contains('teacher-only')) {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            });
        } else {
            if (userName) userName.textContent = '李老师';
            if (switchRoleBtn) switchRoleBtn.textContent = '切换为学生视图';
            if (currentRoleSpan) currentRoleSpan.textContent = '当前身份：教师';
            
            // 显示教师导航，隐藏学生导航
            navLinks.forEach(link => {
                if (link.classList.contains('teacher-only')) {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            });
        }
    }

    // 切换视图
    switchView(viewName) {
        this.currentView = viewName;
        this.showView(viewName);
        this.updateActiveNavLink(viewName);
        this.updateWelcomeText(viewName);
    }

    // 显示指定视图
    showView(viewName) {
        // 隐藏所有视图
        const allViews = document.querySelectorAll('.view-section');
        allViews.forEach(view => {
            view.style.display = 'none';
        });

        // 显示目标视图
        const targetView = document.getElementById(viewName);
        if (targetView) {
            targetView.style.display = 'block';
            
            // 动画效果
            targetView.style.opacity = '0';
            targetView.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetView.style.transition = 'all 300ms ease';
                targetView.style.opacity = '1';
                targetView.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // 更新活跃的导航链接
    updateActiveNavLink(viewName) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-view') === viewName) {
                link.classList.add('active');
            }
        });
    }

    // 更新欢迎文本
    updateWelcomeText(viewName) {
        const welcomeTitle = document.getElementById('welcomeTitle');
        const welcomeSubtitle = document.getElementById('welcomeSubtitle');

        const viewTexts = {
            'my-homework': {
                title: '我的作业',
                subtitle: '查看和提交您的课程作业'
            },
            'my-questions': {
                title: '我的提问',
                subtitle: '管理您的问题和老师的回复'
            },
            'completed': {
                title: '已完成作业',
                subtitle: '查看已完成的作业和评分'
            },
            'homework-management': {
                title: '作业管理',
                subtitle: '管理班级作业和查看提交情况'
            },
            'student-qa': {
                title: '学生问答',
                subtitle: '回答学生问题和查看答疑记录'
            },
            'class-list': {
                title: '班级列表',
                subtitle: '查看班级学生信息和作业完成情况'
            }
        };

        const text = viewTexts[viewName];
        if (text && welcomeTitle && welcomeSubtitle) {
            welcomeTitle.textContent = text.title;
            welcomeSubtitle.textContent = text.subtitle;
        }
    }

    // 切换用户下拉菜单
    toggleUserDropdown() {
        const userDropdown = document.getElementById('userDropdown');
        userDropdown?.classList.toggle('show');
    }

    // 打开提问模态框
    openQuestionModal() {
        const modal = document.getElementById('questionModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // 清空表单
            const form = document.getElementById('questionForm');
            if (form) form.reset();
        }
    }

    // 打开作业发布模态框
    openHomeworkModal() {
        const modal = document.getElementById('homeworkModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // 清空表单
            const form = document.getElementById('homeworkForm');
            if (form) form.reset();
        }
    }

    // 关闭模态框
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // 关闭所有模态框
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }

    // 处理问题提交
    handleQuestionSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const questionData = {
            title: document.getElementById('questionTitle').value,
            subject: document.getElementById('questionSubject').value,
            content: document.getElementById('questionContent').value,
            timestamp: new Date().toISOString()
        };

        // 模拟提交成功
        this.showNotification('问题提交成功！', 'success');
        this.closeModal('questionModal');
        
        // 更新问题列表（实际应用中这里会发送请求到服务器）
        console.log('提交的问题:', questionData);
    }

    // 处理作业发布
    handleHomeworkSubmit(e) {
        e.preventDefault();
        
        const homeworkData = {
            title: document.getElementById('homeworkTitle').value,
            subject: document.getElementById('homeworkSubject').value,
            class: document.getElementById('homeworkClass').value,
            deadline: document.getElementById('homeworkDeadline').value,
            content: document.getElementById('homeworkContent').value,
            timestamp: new Date().toISOString()
        };

        // 模拟发布成功
        this.showNotification('作业发布成功！', 'success');
        this.closeModal('homeworkModal');
        
        // 更新作业列表（实际应用中这里会发送请求到服务器）
        console.log('发布的作业:', homeworkData);
    }

    // 过滤问题
    filterQuestions(status) {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-status') === status) {
                btn.classList.add('active');
            }
        });

        const questionCards = document.querySelectorAll('.question-card');
        questionCards.forEach(card => {
            if (status === 'all') {
                card.style.display = 'block';
            } else {
                const hasAnswered = card.classList.contains('answered');
                if ((status === 'pending' && !hasAnswered) || 
                    (status === 'answered' && hasAnswered)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#D1FAE5' : type === 'error' ? '#FEE2E2' : '#DBEAFE'};
            color: ${type === 'success' ? '#059669' : type === 'error' ? '#DC2626' : '#2563EB'};
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 2000;
            transform: translateX(100%);
            transition: transform 300ms ease;
            max-width: 300px;
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            opacity: 0.7;
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动关闭
        setTimeout(() => {
            this.hideNotification(notification);
        }, 3000);

        // 手动关闭
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }

    // 隐藏通知
    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300ms);
    }

    // 响应式处理
    handleResponsive() {
        const handleResize = () => {
            const navLinks = document.querySelector('.nav-links');
            const navRight = document.querySelector('.nav-right');
            
            if (window.innerWidth <= 768) {
                // 移动端处理
                if (navLinks) {
                    navLinks.style.display = 'none';
                }
            } else {
                // 桌面端处理
                if (navLinks) {
                    navLinks.style.display = 'flex';
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 初始化调用
    }

    // 获取统计数据的公共方法（可以用于实时更新）
    getStatistics() {
        // 模拟API调用获取统计数据
        return {
            student: {
                pendingHomework: 8,
                submittedHomework: 15,
                gradedHomework: 12,
                totalQuestions: 2,
                answeredQuestions: 1
            },
            teacher: {
                pendingGrading: 25,
                completedGrading: 87,
                totalStudents: 156,
                totalQuestions: 12,
                pendingAnswers: 3
            }
        };
    }

    // 更新统计数据显示
    updateStatistics() {
        const stats = this.getStatistics();
        const currentStats = this.currentRole === 'student' ? stats.student : stats.teacher;
        
        // 这里可以更新页面上的统计数据
        console.log('当前统计数据:', currentStats);
    }
}

// 工具函数类
class Utils {
    // 格式化日期
    static formatDate(date) {
        return new Date(date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 计算时间差
    static getTimeDifference(date) {
        const now = new Date();
        const past = new Date(date);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) {
            return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else {
            return `${diffDays}天前`;
        }
    }

    // 文件大小格式化
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 防抖函数
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 数据模拟类
class DataManager {
    // 模拟学生作业数据
    static getStudentHomework() {
        return [
            {
                id: 1,
                title: 'JavaScript基础语法练习',
                description: '完成教材第三章所有例题的编程练习，包括变量声明、函数定义和对象操作。',
                deadline: '2025-12-05T23:59:00',
                subject: 'Web开发技术',
                status: 'pending',
                score: null
            },
            {
                id: 2,
                title: '数据库设计项目',
                description: '设计一个学生管理系统的数据库，包括ER图绘制和SQL建表语句。',
                deadline: '2025-11-30T23:59:00',
                subject: '数据库原理',
                status: 'submitted',
                score: null
            },
            {
                id: 3,
                title: '网页布局实战',
                description: '使用HTML和CSS制作一个响应式个人简介页面，要求包含导航栏、头像和技能展示。',
                deadline: '2025-11-25T23:59:00',
                subject: '前端开发',
                status: 'graded',
                score: 92
            }
        ];
    }

    // 模拟学生问题数据
    static getStudentQuestions() {
        return [
            {
                id: 'Q001',
                title: '关于JavaScript闭包的理解问题',
                content: '在学习闭包概念时，对作用域链的理解有些困惑，能否通过一个具体的例子来说明？',
                subject: 'Web开发技术',
                teacher: '李老师',
                status: 'answered',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
                answer: '闭包是指有权访问另一个函数作用域中变量的函数。简单来说...'
            },
            {
                id: 'Q002',
                title: '数据库索引优化建议',
                content: '我的学生管理系统查询效率很低，数据库有10万条学生记录，搜索一个学生信息需要3-5秒，应该如何优化？',
                subject: '数据库原理',
                teacher: '王老师',
                status: 'pending',
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1天前
                answer: null
            }
        ];
    }

    // 模拟教师作业管理数据
    static getTeacherHomework() {
        return [
            {
                id: 1,
                title: 'JavaScript基础语法练习',
                description: '完成教材第三章所有例题的编程练习，包括变量声明、函数定义和对象操作。',
                deadline: '2025-12-05T23:59:00',
                subject: 'Web开发技术',
                submissionRate: '15/18',
                gradingRate: '12/15'
            },
            {
                id: 2,
                title: '数据库设计项目',
                description: '设计一个学生管理系统的数据库，包括ER图绘制和SQL建表语句。',
                deadline: '2025-11-30T23:59:00',
                subject: '数据库原理',
                submissionRate: '18/18',
                gradingRate: '16/18'
            }
        ];
    }

    // 模拟学生班级数据
    static getClassData() {
        return [
            {
                name: '张小明',
                studentId: '2021001',
                completionRate: 94,
                completedHomework: 15,
                totalHomework: 16,
                status: 'excellent'
            },
            {
                name: '李小红',
                studentId: '2021002',
                completionRate: 75,
                completedHomework: 12,
                totalHomework: 16,
                status: 'good'
            },
            {
                name: '王大强',
                studentId: '2021003',
                completionRate: 50,
                completedHomework: 8,
                totalHomework: 16,
                status: 'poor'
            }
        ];
    }
}

// 页面加载完成后初始化系统
document.addEventListener('DOMContentLoaded', () => {
    // 检查必要的DOM元素是否存在
    const requiredElements = ['userBtn', 'navLinks'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('Missing required elements:', missingElements);
        return;
    }

    // 初始化学习反馈系统
    window.learningSystem = new LearningFeedbackSystem();
    
    // 添加一些测试数据（实际应用中这些数据会从API获取）
    console.log('学习反馈系统初始化完成');
    console.log('学生作业数据:', DataManager.getStudentHomework());
    console.log('学生问题数据:', DataManager.getStudentQuestions());
    console.log('教师作业数据:', DataManager.getTeacherHomework());
    console.log('班级数据:', DataManager.getClassData());
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LearningFeedbackSystem,
        DataManager,
        Utils
    };
}