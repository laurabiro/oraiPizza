import "./style.css";
import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";

//PIZZA CHOICES:
const margherita = document.getElementById("margherita") as HTMLParagraphElement
const funghi = document.getElementById("funghi") as HTMLParagraphElement
const quattroFormaggi = document.getElementById("quattro") as HTMLParagraphElement
const pepperoni = document.getElementById("pepperoni") as HTMLParagraphElement
const capricciose = document.getElementById("capricciose") as HTMLParagraphElement
const grandmas = document.getElementById("grandmas") as HTMLParagraphElement
const neapolitan = document.getElementById("neapolitan") as HTMLParagraphElement
//CHANGES ON THE CARD:
const changePizzas = document.getElementById("change-pizzas") as HTMLDivElement
const name = document.getElementById("name") as HTMLHeadingElement
const toppings = document.getElementById("toppings") as HTMLUListElement
const image = document.getElementById("img") as HTMLImageElement
//ACTIONS:
const number = document.getElementById("number") as HTMLInputElement
const addToOrder = document.getElementById("add-to-order") as HTMLButtonElement
//ORDER FIELD:



// CARD TOGGLE:
changePizzas.style.display = "none"

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
/* function toggle() {
  const x = document.getElementById("change-pizzas") as HTMLDivElement;
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
} */

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
       
        /*    let li = document.createElement("li")
        let text = document.createTextNode(`${data[i].toppings[j]}`)
        li.appendChild(text)
        toppings.appendChild(li) */

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


// PIZZA CHOICES:
margherita.addEventListener("click", async load => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 1)
  changeToppings(result.data, 1)
  changeImg(result.data, 1)
  toggle(1)
})

quattroFormaggi.addEventListener("click", async load => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 2)
  changeToppings(result.data, 2)
  changeImg(result.data, 2)
  toggle(2)
})

funghi.addEventListener("click", async load => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 3)
  changeToppings(result.data, 3)
  changeImg(result.data, 3)
  toggle(3)
})

pepperoni.addEventListener("click", async load => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 4)
  changeToppings(result.data, 4)
  changeImg(result.data, 4)
  toggle(4)
})

capricciose.addEventListener("click", async load => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 5)
  changeToppings(result.data, 5)
  changeImg(result.data, 5)
  toggle(5)
})

grandmas.addEventListener("click", async load => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 6)
  changeToppings(result.data, 6)
  changeImg(result.data, 6)
  toggle(6)
})

neapolitan.addEventListener("click", async load => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 7)
  changeToppings(result.data, 7)
  changeImg(result.data, 7)
  toggle(7)
})

/* const load = async () => {
  let response = await getData()
  if(!response){
    return 400
  }
  
  const result = PizzaResponseScheme.safeParse(response.data);

  if (!result.success) {
    console.log(result.error);
    return 404;
  }

  changeName(result.data, 2)
  toggle()

} */