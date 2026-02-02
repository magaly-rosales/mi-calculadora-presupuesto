const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// 1. NUEVO: Intentar leer datos de LocalStorage al iniciar. 
// Si no hay nada, inicializamos con un arreglo vacío [].
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// 2. NUEVO: Función para actualizar el LocalStorage cada vez que algo cambie
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Por favor, añade una descripción y un monto');
  } else {
    const transaction = {
      id: Math.floor(Math.random() * 1000000),
      text: text.value,
      amount: +amount.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage(); // <--- NUEVO: Guardamos después de agregar

    text.value = '';
    amount.value = '';
  }
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign} S/ ${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// 3. NUEVO: Función para eliminar transacciones (¡Muy importante!)
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage(); // <--- NUEVO: Guardamos después de eliminar
  init(); // Reiniciamos la vista
}
function updateValues() {
  // Obtenemos solo los números del arreglo de objetos
  const amounts = transactions.map(transaction => transaction.amount);

  // El TOTAL es la suma simple de todo (los negativos restan automáticamente)
  const total = amounts
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // INGRESOS: Filtramos los mayores a 0 y sumamos
  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  // GASTOS: Filtramos los menores a 0, sumamos y multiplicamos por -1 
  // para mostrarlo como un número positivo en el resumen de "Gastos"
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  // Actualizamos el DOM
  balance.innerText = `S/ ${total}`;
  money_plus.innerText = `+ S/ ${income}`;
  money_minus.innerText = `- S/ ${expense}`;
}

// 4. NUEVO: Función para inicializar la App y mostrar los datos guardados
function init() {
  list.innerHTML = ''; // Limpiamos la lista visual
  transactions.forEach(addTransactionDOM); // Dibujamos cada transacción guardada
  updateValues(); // Calculamos totales
}

init(); // Arrancamos la App

form.addEventListener('submit', addTransaction);

function generarBoleto() {
    const total = balance.innerText;
    const ingresos = money_plus.innerText;
    const gastos = money_minus.innerText;
    const fecha = new Date().toLocaleDateString();
    
    const boletoDiv = document.getElementById('boleto-salida');
    
    // Crear el contenido del boleto
    boletoDiv.innerHTML = `
        <div style="text-align: center;">
            <strong>*** RESUMEN DE CUENTA ***</strong><br>
            Fecha: ${fecha}
        </div>
        <hr>
        <p>Total Ingresos: ${ingresos}</p>
        <p>Total Deudas/Gastos: ${gastos}</p>
        <hr>
        <p style="font-size: 18px;"><strong>SALDO NETO: ${total}</strong></p>
        <p style="font-size: 11px; text-align: center;">Generado por Control de Gastos App</p>
        <button class="btn" onclick="window.print()" style="font-size: 12px; margin-top: 10px;">Imprimir PDF</button>
    `;
    
    // Mostrar el div (estaba oculto)
    boletoDiv.style.display = 'block';
}