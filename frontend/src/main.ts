import "./style.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";

//PIZZA CHOICES:
const pizzas = document.getElementsByClassName("pizza") as HTMLCollectionOf<HTMLParagraphElement>
//CHANGES ON THE CARD:
const changePizzas = document.getElementById("change-pizzas") as HTMLDivElement
const name = document.getElementById("name") as HTMLHeadingElement
const toppings = document.getElementById("toppings") as HTMLUListElement
const image = document.getElementById("img") as HTMLImageElement
//ACTIONS:
const number = document.getElementById("number") as HTMLInputElement
const addToOrder = document.getElementById("add-to-order") as HTMLButtonElement
//ORDER DETAILS:
const details = document.getElementById("order-field") as HTMLDivElement
const orderedPizzas = document.getElementById("yp-description") as HTMLUListElement
const listedPizzas = document.getElementsByClassName("ordered") as HTMLCollectionOf<HTMLLIElement>
//ORDER INPUTS:
const orderName = document.getElementById("name2") as HTMLInputElement
const orderZip = document.getElementById("zip") as HTMLInputElement
const orderCity = document.getElementById("city") as HTMLInputElement
const orderStreet = document.getElementById("street") as HTMLInputElement
const orderHouse = document.getElementById("house") as HTMLInputElement
const orderPhone = document.getElementById("phone") as HTMLInputElement
const orderEmail = document.getElementById("email") as HTMLInputElement
//ORDER BUTTON:
const orderButton = document.getElementById("so-button") as HTMLButtonElement

// DISPLAY NONES:
changePizzas.style.display = "none"
details.style.display = "none"

//CARD TOGGLE:
function toggle(pizzaId:number | null) {
  let currentPizzaId = null
  const x = changePizzas

  // if the card is already visible and clicked on the same pizza, hide it:
  if (currentPizzaId !== pizzaId) {
    currentPizzaId = pizzaId
    x.style.display = "block"
  } else {
    currentPizzaId = -1
    x.style.display = "none"
  }
}

// DATA ZOD:
const PizzaResponseScheme = z.object({
  id: z.number().optional(),
  name: z.string(),
  toppings: z.string().array(),
  url: z.string(),
}).array()
type PizzaResponse = z.infer<typeof PizzaResponseScheme>;

// DATA!!!
const getData = async () => {
  let response;
  try {
    response = await axios.get("http://localhost:3333")
  } catch (error) {
    return (error as AxiosError ).response || null
  }

  return response;
}

// CHANGES ON THE CARD:
const changeName = (data:PizzaResponse, id:number) => {

  for(let i = 0; i<data.length; i++){
    if(id===data[i].id)
      return name.innerHTML = data[i].name
  }
}
const changeToppings = (data:PizzaResponse, id:number) => {
  let i = 0
  while(data[i] !== undefined){
    toppings.innerHTML = ""
    
    if(id===data[i].id){
      let j = 0
      while(data[i].toppings[j] !== undefined){
        toppings.innerHTML += `<li>${data[i].toppings[j]}</li>`

        j++
      }
      break
    }  
    i++
  }
}
const changeImg = (data:PizzaResponse, id:number) => {
  console.log("done")
  for (let i = 0; i < data.length; i++) {
    if (id === data[i].id) {
      return image.src = data[i].url
    }
  }
}

const pizzaListener = async (event:MouseEvent) => {
  //console.log(event)
  //console.log((event.target as HTMLParagraphElement).id) */
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data)

  if (!result.success) {
    console.log(result.error)
    return 404
  }

  number.value = "1"
  changeName(result.data, +(event.target as HTMLParagraphElement).id)
  changeToppings(result.data, +(event.target as HTMLParagraphElement).id)
  changeImg(result.data, +(event.target as HTMLParagraphElement).id)
  toggle(+(event.target as HTMLParagraphElement).id)
}

// PIZZA CHOICES:
for (let i = 0; i < pizzas.length; i++) {
  const element = pizzas[i]
  element.addEventListener("click", pizzaListener)
}
// ORDER DETAILS:
function loadDetails() {
  if (details.style.display === "none") {
    details.style.display = "block"
  }

  orderedPizzas.innerHTML += `<li class="ordered"> ${+number.value}  x  ${name.innerHTML} </li>`
}

addToOrder.addEventListener("click", loadDetails)

// SAVE ORDER:

const getDetails = () => {
  let i = 0
  let result:string[] = []
  while(listedPizzas[i] !== undefined){
    result = [...result, listedPizzas[i].innerHTML]
    i++
  }
  return result
}
const date = new Date().toUTCString();
console.log(date)
orderButton.addEventListener("click", async function() {
  const order = {
    "ordered pizzas":getDetails(),
    "name":orderName.value,
    "zip code":orderZip.value,
    "city":orderCity.value,
    "street":orderStreet.value,
    "house number":orderHouse.value,
    "phone number":orderPhone.value,
    "email":orderEmail.value,
    "date":date
  }

  try {
    const config = {
      method: "POST",
      body: JSON.stringify(order),
      
    }
    console.dir(config)
    const response = await axios.post('http://localhost:3333/', order)
    console.log('Data sent successfully:', response.data)
  } catch (error) {
    console.error('Error sending data:', error)
  }
  
})