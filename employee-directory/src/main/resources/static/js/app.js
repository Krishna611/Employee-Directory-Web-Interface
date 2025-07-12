document.addEventListener("DOMContentLoaded", function () {
  // Dark mode toggle
  const toggleBtn = document.getElementById("darkModeToggle");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Optional: change button text/icon
    toggleBtn.textContent = document.body.classList.contains("dark")
      ? "☀️ Light Mode"
      : "🌙 Dark Mode";
  });

  // Mock data clone
  let employees = [...mockEmployees];
  let currentPage = 1;
  let itemsPerPage = 5;
  let filteredEmployees = [...employees];
  let editingId = null;

  // DOM elements
  const employeeList = document.getElementById("employeeList");
  const employeeForm = document.getElementById("employeeForm");
  const employeeFormContainer = document.getElementById("employeeFormContainer");
  const paginationControls = document.getElementById("paginationControls");
  const searchInput = document.getElementById("searchInput");
  const filterPanel = document.getElementById("filterPanel");
  const filterToggle = document.getElementById("filterToggle");
  const sortBySelect = document.getElementById("sortBy");

  // Render employee cards
  function renderEmployees() {
    employeeList.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageEmployees = filteredEmployees.slice(startIndex, endIndex);

    if (pageEmployees.length === 0) {
      employeeList.innerHTML = "<p>No employees found.</p>";
      return;
    }

    pageEmployees.forEach((emp) => {
      const card = document.createElement("div");
      card.className = "employee-card";
      card.innerHTML = `
        <h3>${emp.firstName} ${emp.lastName}</h3>
        <p><strong>ID:</strong> ${emp.id}</p>
        <p><strong>Email:</strong> ${emp.email}</p>
        <p><strong>Department:</strong> ${emp.department}</p>
        <p><strong>Role:</strong> ${emp.role}</p>
        <button onclick="editEmployee(${emp.id})">Edit</button>
        <button onclick="deleteEmployee(${emp.id})">Delete</button>
      `;
      employeeList.appendChild(card);
    });

    renderPagination();
  }

  // Render pagination buttons
  function renderPagination() {
    paginationControls.innerHTML = "";
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.className = currentPage === i ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderEmployees();
      });
      paginationControls.appendChild(btn);
    }
  }

  // Add/Edit employee
  employeeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value.trim();
    const role = document.getElementById("role").value.trim();

    if (!firstName || !lastName || !email || !department || !role) {
      alert("Please fill all fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (editingId) {
      // Edit existing
      const index = employees.findIndex((e) => e.id === editingId);
      employees[index] = { id: editingId, firstName, lastName, email, department, role };
      editingId = null;
    } else {
      // Add new
      const newId = Date.now();
      employees.push({ id: newId, firstName, lastName, email, department, role });
    }

    filteredEmployees = [...employees];
    employeeForm.reset();
    employeeFormContainer.classList.add("hidden");
    renderEmployees();
  });

  // Edit employee
  window.editEmployee = function (id) {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;

    editingId = id;
    document.getElementById("firstName").value = emp.firstName;
    document.getElementById("lastName").value = emp.lastName;
    document.getElementById("email").value = emp.email;
    document.getElementById("department").value = emp.department;
    document.getElementById("role").value = emp.role;

    document.getElementById("formTitle").innerText = "Edit Employee";
    employeeFormContainer.classList.remove("hidden");
  };

  // Delete employee
  window.deleteEmployee = function (id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    employees = employees.filter((e) => e.id !== id);
    filteredEmployees = [...employees];
    renderEmployees();
  };

  // Show add form
  document.getElementById("addNew").addEventListener("click", () => {
    editingId = null;
    employeeForm.reset();
    document.getElementById("formTitle").innerText = "Add New Employee";
    employeeFormContainer.classList.remove("hidden");
  });

  // Cancel form
  document.getElementById("cancelForm").addEventListener("click", () => {
    employeeFormContainer.classList.add("hidden");
    employeeForm.reset();
    editingId = null;
  });

  // Search
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    filteredEmployees = employees.filter((emp) =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
    currentPage = 1;
    renderEmployees();
  });

  // Filter toggle
  filterToggle.addEventListener("click", () => {
    filterPanel.classList.toggle("hidden");
  });

  // Apply filters
  document.getElementById("applyFilters").addEventListener("click", () => {
    const dept = document.getElementById("filterDept").value.toLowerCase();
    const role = document.getElementById("filterRole").value.toLowerCase();

    filteredEmployees = employees.filter((emp) =>
      (dept === "" || emp.department.toLowerCase().includes(dept)) &&
      (role === "" || emp.role.toLowerCase().includes(role))
    );

    currentPage = 1;
    renderEmployees();
  });

  // Clear filters
  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("filterDept").value = "";
    document.getElementById("filterRole").value = "";
    filteredEmployees = [...employees];
    renderEmployees();
  });

  // Sort
  sortBySelect.addEventListener("change", () => {
    const sortKey = sortBySelect.value;
    filteredEmployees.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      return valA.localeCompare(valB);
    });
    renderEmployees();
  });

  // Email validation helper
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Initial render
  renderEmployees();
});
