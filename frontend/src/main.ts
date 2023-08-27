import "./style.css"
import axios from "axios"
import { z } from "zod"

const PizzaSchema = z.object ({
  id: z.number(),
  name: z.string(),
  toppings: z.string().array(),
  url: z.string(),
})

type Pizza = z.infer<typeof PizzaSchema>

type Order = {
  name: string,
  zipCode: string,
  items: {
    id: number,
    amount: number
  }[]
}

// app state
let isLoading = false
let pizzas: Pizza[] = []
let selectedPizza: Pizza | null = null
let amount = 0
let order: Order | null = null
let isSending = false

// mutation

const selectCard = document.getElementById("selected") as HTMLDivElement
const orderCard = document.getElementById("order") as HTMLDivElement
selectCard.style.display = "none"
orderCard.style.display = "none"

const date = new Date().toUTCString();

const getPizzas = async () => {
  isLoading = true

  const response = await axios.get("http://localhost:3333/api/pizza")
  isLoading = false

  const result = PizzaSchema.array().safeParse(response.data)
  if (!result.success)
    pizzas = []
  else
    pizzas = result.data
}

const postPizzas = async () => {
  isSending = true
  
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const zipInput = document.getElementById("zip") as HTMLInputElement;

    const name = nameInput.value;
    const zipCode = zipInput.value;

    const orderField = {
      "ordered pizzas":getOrderDetails(),
      "name": name,
      "zip code": zipCode,
      "date":date,
    }
  
  try {
    const config = {
      method: "POST",
      body: JSON.stringify(orderField),
    }
    console.dir(config)
    const response = await axios.post('http://localhost:3333/api/order', orderField)
    console.log('Data sent successfully:', response.data)
  } catch (error) {
    console.error('Error sending data:', error)
  }
}

const selectPizza = (id: number) => {
  selectedPizza = pizzas.find(pizza => pizza.id === id) || null
}

const updateAmount = (num: number) => {
  amount = num
}

const deleteItem = (id:number) => {
  if (order) { order = {
    name: order.name,
    zipCode: order.zipCode,
    items: [
      ...order.items.filter(item => item.id !== id)
    ]
  } 
}
}

const updateOrderWithItem = () => {
  order = order ? {
    name: order.name,
    zipCode: order.zipCode,
    items: [
      ...order.items.filter(item => item.id !== selectedPizza!.id),
      { id: selectedPizza!.id, amount }
    ]
  } : {
    name: "",
    zipCode: "",
    items: [
      { id: selectedPizza!.id, amount }
    ]
  }
}

const getOrderDetails = () => {
  const listedPizzas = document.getElementsByClassName("ordering-pizzas")
  let i = 0
  let result:string[] = []
  while(listedPizzas[i] !== undefined){
    result = [...result, listedPizzas[i].innerHTML]
    i++
  }
  return result
}

const deletePost = () => {
  if (order) { order = {
    name: "",
    zipCode: "",
    items: [
    ]
  } 
}
}


// render
const renderList = (pizzas: Pizza[]) => {
  const container = document.getElementById("list")!
  
  for (const pizza of pizzas) {
    const pizzaParagraph = document.createElement("p")
    pizzaParagraph.innerText = pizza.name
    pizzaParagraph.id = "" + pizza.id
    container.appendChild(pizzaParagraph)
    pizzaParagraph.addEventListener("click", selectListener)
  }
}

const renderSelected = (pizza: Pizza) => {
  const content = `
    <div>
      <h1>${pizza.name}</h1>
      <p id="" class="bg-red-600">${pizza.toppings}</p>
      <img id="img" src="${pizza.url}" />
      <input type="number" id="amount" />
      <button id="add">Add to order</button>
    </div>
  `
  document.getElementById("selected")!.innerHTML = content
  document.getElementById("add")!.addEventListener("click", addListener);
  (document.getElementById("amount") as HTMLInputElement).addEventListener("change", changeListener)
}

const renderOrder = (order: Order) => {
  const content = `
    <div>
      <h1>Your order</h1>
      ${order.items.map(item => `
        <div class="orderline">
        <p class="ordering-pizzas bg-red-500 ">${item.amount} x ${pizzas.find(pizza => pizza.id === item.id)!.name}</p>
        <button id="x-${item.id}">X</button>
        </div>
      `).join('')}
      <input placeholder="Name" id="name" />
      <input placeholder="Zip code" id="zip" />
      <button id="send" >Send order</button>
    </div>
  `

  document.getElementById("order")!.innerHTML = content

  for (let i = 0; i < order.items.length; i++) {
    let item = order.items[i]
      document.getElementById(`x-${item.id}`)!.addEventListener("click", deleteListener)
  }
  document.getElementById("send")!.addEventListener("click", postListener)
  document.getElementById("send")!.addEventListener("click", deletePostListener)
}




// eventListeners
const init = async () => {
  await getPizzas()
  if (pizzas.length)
    renderList(pizzas)
}

const selectListener = (event: Event) => {
  selectPizza(+(event.target as HTMLParagraphElement).id)
  if (selectedPizza)
    renderSelected(selectedPizza)

  selectCard.style.display = "block"
}

const changeListener = (event: Event) => {
  updateAmount(+(event.target as HTMLInputElement).value)
}

const addListener = () => {
  updateOrderWithItem()
  if (order)
    renderOrder(order)

  orderCard.style.display = "block"
}

const deleteListener = (event: Event) => {
  deleteItem(+(event.target as HTMLButtonElement).id.split("-")[1]);
  if (order) {
    renderOrder(order)
  }
}

const postListener = () => {
  postPizzas()
  updateOrderWithItem()
  if(order){
    renderOrder(order)
  }
}

const deletePostListener = () => {
  deletePost()
  orderCard.style.display = "none"
  selectCard.style.display = "none"
}





init()