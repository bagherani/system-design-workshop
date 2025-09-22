import { getUsers } from '@io/data-models';

export default async function Index() {
  await getUsers({ baseUrl: process.env.USERS_SERVICE_URL });

  return (
    <div>
      <h1>Welcome to the System Design Workshop</h1>
    </div>
  );
}
