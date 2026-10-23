export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [serviceType, username, intUserID, providerID] = slug;
  return <div>My Post: {slug}</div>;
}
