import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCompany() {
  return <main className="detail-main loading-detail"><Skeleton className="h-4 w-52" /><section><Skeleton className="h-24 w-24 rounded-2xl" /><div><Skeleton className="h-12 w-72" /><Skeleton className="mt-4 h-5 w-96 max-w-full" /></div></section><div className="loading-columns"><Skeleton className="h-96" /><Skeleton className="h-96" /></div></main>;
}
