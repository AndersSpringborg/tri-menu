import { api } from "~/utils/api";
import { Spinner } from "~/components/spinner";

export function Menu({ date }: { date: Date }) {
  const { data, error } = api.menu.getItems.useQuery({
    date: date,
  });

  if (error) {
    // Error state
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="mb-8 text-4xl font-bold">Menu</h1>
        <p className="whitespace-break-spaces text-red-600">{error.message}</p>
      </div>
    );
  }

  if (!data) {
    // Loading state
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="mb-8 text-4xl font-bold">Menu</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Menu</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white">
          <thead>
            <tr>
              <th className="bg-gray-800 px-4 py-2 text-sm font-semibold uppercase text-white">
                Dagens menu
              </th>
              <th className="bg-gray-800 px-4 py-2 text-sm font-semibold uppercase text-white">
                Co2
              </th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((dish, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="border-b px-4 py-2">{dish.description.name}</td>
                <td className="border-b px-4 py-2">
                  {dish.co2 ?? "Not found"} {dish.co2 ? "kg" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
