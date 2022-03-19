import { RoutingProvider } from "../contexts/RoutingContext"
import { AppRouter } from "./AppRouter"

export const AppRoot: React.FC = () => {
  return (
    <RoutingProvider>
      <AppRouter />
    </RoutingProvider>
  )
}
