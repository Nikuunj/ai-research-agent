import ResearchDetail from "@/components/ResearchDetail";

export default async function ResearchDetailPage({ params }: { params: Promise<{ id: string }> }) {
   const resolvedParams = await params;
   const id = Number(resolvedParams.id);

   return <ResearchDetail id={id}/>

}
