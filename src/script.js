// Adiciona event listeners
document.getElementById('searchIcon').addEventListener('click', () => searchEmployee());
document.getElementById('searchInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    searchEmployee();
  }
});

// Função para buscar empregados
const fetchEmployees = async (query = '') => {
  try {
    const response = await fetch('../db.json');
    if (!response.ok) {
      throw new Error('Erro ao buscar dados');
    }
    const data = await response.json();
    const employees = data.employees;
    const filteredEmployees = query
      ? filterEmployees(employees, query)
      : employees;
    processEmployees(filteredEmployees);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

// Função para filtrar empregados
const filterEmployees = (employees, query) => {
  return employees.filter(employee =>
    employee.name.toLowerCase().includes(query.toLowerCase()) ||
    employee.job.toLowerCase().includes(query.toLowerCase()) ||
    employee.phone.toLowerCase().includes(query.toLowerCase())
  );
};

// Função para processar empregados
const processEmployees = (employees) => {
  const divEmployees = document.getElementById("divEmployeesId");
  divEmployees.innerHTML = ''; // Limpa os resultados anteriores

  if (employees.length === 0) {
    divEmployees.innerHTML = '<p>No employees found</p>';
  } else {
    employees.forEach((employee) => {
      const formattedDate = formatDate(employee.admission_date);
      const formattedPhoneNumber = formatPhoneNumber(employee.phone);
      const employeeElement = createEmployeeElement(employee, formattedDate, formattedPhoneNumber);
      divEmployees.appendChild(employeeElement);
    });
  }
};

// Função para formatar data
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
};

// Função para formatar número de telefone
const formatPhoneNumber = (phoneNumber) => {
  return `+${phoneNumber.slice(0, 2)}(${phoneNumber.slice(2, 4)})${phoneNumber.slice(4, 9)}-${phoneNumber.slice(9)}`;
};

// Função para criar elemento de empregado
const createEmployeeElement = (employee, formattedDate, formattedPhoneNumber) => {
  const ul = document.createElement("ul");
  ul.classList.add(
    "flex",
    "justify-around",
    "md:grid",
    "md:grid-cols-5",
    "border",
    "border-b-slate-300",
    "bg-white",
    "py-2",
    "text-xl"
  );
  ul.innerHTML = `
    <li class="place-self-center">
      <img class="rounded-full" src="${employee.image}">
    </li>
    <li class="place-self-center">${employee.name}</li>
    <li class="place-self-center hidden md:flex">${employee.job}</li>
    <li class="place-self-center hidden md:flex">${formattedDate}</li>
    <li class="place-self-center hidden md:flex">${formattedPhoneNumber}</li>
    <li class="place-self-center md:hidden text-blue-400">
      <button class="" type="button" onclick="toggleEmployeeInfo(this)">
        <i class="fa-solid fa-angle-down text-3xl"></i>
      </button>
    </li>`;
  return ul;
};

// Função para alternar exibição de informações adicionais do empregado
const toggleEmployeeInfo = (button) => {
  const employeeInfo = button.parentElement.nextElementSibling;
  if (employeeInfo && employeeInfo.classList.contains('employee-info')) {
    employeeInfo.remove();
  } else {
    const employeeElement = button.parentElement.parentElement;
    const employeeData = {
      job: employeeElement.querySelector('.hidden.md\\:flex:nth-child(3)').textContent.trim(),
      admissionDate: employeeElement.querySelector('.hidden.md\\:flex:nth-child(4)').textContent.trim(),
      phoneNumber: employeeElement.querySelector('.hidden.md\\:flex:nth-child(5)').textContent.trim()
    };
    const employeeInfoElement = createEmployeeInfoElement(employeeData);
    button.parentElement.parentElement.appendChild(employeeInfoElement);
  }
};

// Função para criar elemento de informações adicionais do empregado
const createEmployeeInfoElement = (employeeData) => {
  const li = document.createElement("li");
  li.classList.add("md:hidden", "employee-info", "bg-slate-100", "rounded-md", "m-auto");
  li.innerHTML = `
    <div>Cargo: ${employeeData.job}</div>
    <div>Data de admissão: ${employeeData.admissionDate}</div>
    <div>Telefone: ${employeeData.phoneNumber}</div>
  `;
  return li;
};

// Função para buscar e processar empregados com base na pesquisa
const searchEmployee = () => {
  const query = document.getElementById('searchInput').value;
  fetchEmployees(query);
};

// Busca inicial de empregados
fetchEmployees();
