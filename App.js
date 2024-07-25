import AppNavigation from "./src/navigation/AppNavigation";
import { ComplaintProvider } from "./src/contexts/ComplaintContext";

export default function App() {
  return (
    <ComplaintProvider>
      <AppNavigation />
    </ComplaintProvider>
  );
}
