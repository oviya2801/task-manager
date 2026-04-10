export function FilterBar({ filter, onChange, counts }) {
  const filters = [
    { value: "all", label: "All", count: counts.all },
    { value: "incomplete", label: "Active", count: counts.incomplete },
    { value: "completed", label: "Done", count: counts.completed },
  ];

  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks">
      {filters.map((f) => (
        <button
          key={f.value}
          className={`filter-bar__btn${filter === f.value ? " filter-bar__btn--active" : ""}`}
          onClick={() => onChange(f.value)}
          aria-pressed={filter === f.value}
        >
          {f.label}
          <span className="filter-bar__count">{f.count}</span>
        </button>
      ))}
    </div>
  );
}
