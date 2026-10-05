"use client";

interface Props {
  studentId: string;
  studentName: string;
  action: (formData: FormData) => void;
}

/** A confirm-gated delete form — asks before submitting, since removing a profile deletes all of that child's progress. */
export function DeleteStudentButton({ studentId, studentName, action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Remove ${studentName}'s profile? This deletes all of their progress, coins, and creatures — it can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="studentId" value={studentId} />
      <button type="submit" className="text-xs font-semibold text-rose-500 hover:text-rose-600 underline">
        Remove
      </button>
    </form>
  );
}
