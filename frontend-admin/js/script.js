
const API_URL = 'http://localhost:3000/admin';
const coursesTable = document.getElementById('courses-table').getElementsByTagName('tbody')[0];
const addCourseForm = document.getElementById('add-course-form');

async function getCourses() {
    const response = await fetch(`${API_URL}/courses`, {
        headers: { 'Authorization': 'Bearer YOUR_ADMIN_TOKEN' } // Replace with a real token
    });
    const courses = await response.json();
    coursesTable.innerHTML = '';
    courses.forEach(course => {
        const row = coursesTable.insertRow();
        row.innerHTML = `
            <td>${course.course_id}</td>
            <td>${new Date(course.start_time).toLocaleString()}</td>
            <td>${new Date(course.end_time).toLocaleString()}</td>
            <td>${course.coach_id}</td>
            <td><button onclick="deleteCourse(${course.course_id})">Delete</button></td>
        `;
    });
}

addCourseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const coachId = document.getElementById('coach-id').value;
    const studentIds = document.getElementById('student-ids').value.split(',').map(id => parseInt(id.trim()));

    await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_ADMIN_TOKEN' // Replace with a real token
        },
        body: JSON.stringify({
            start_time: startTime,
            end_time: endTime,
            coach_id: parseInt(coachId),
            student_ids: studentIds
        })
    });
    addCourseForm.reset();
    getCourses();
});

async function deleteCourse(id) {
    await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer YOUR_ADMIN_TOKEN' } // Replace with a real token
    });
    getCourses();
}

getCourses();
