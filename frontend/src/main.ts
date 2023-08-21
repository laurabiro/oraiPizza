import "./style.css";
import axios from "axios";
import { z } from "zod";

const PizzaSchema = z.object ({
  id: z.string(),
  name: z.string(),
  toppings: z.string().array(),
  url: z.string(),
})

type Pizza = z.infer<typeof PizzaSchema>

let pizzas: Pizza[] = []