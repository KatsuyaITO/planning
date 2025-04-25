import PlanningSpreadsheet from "@/components/planning-spreadsheet"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Department Planning Tool</h1>
      <PlanningSpreadsheet />
    </div>
  )
}
