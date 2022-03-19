import { useContext } from "react"
import { RoutingContext } from "../contexts/RoutingContext"

export const useRouting = () => {
  return useContext(RoutingContext);
}