type ParentRegistrationMissingAlertProps = {
  message?: string;
};

const ParentRegistrationMissingAlert = ({
  message = "registro no econtrado",
}: ParentRegistrationMissingAlertProps) => {
  return (
    <section className="px-6 py-4">
      <div className="landing-module-card border-red-300/40 bg-red-500/10">
        <p className="font-semibold text-red-100">{message}</p>
      </div>
    </section>
  );
};

export default ParentRegistrationMissingAlert;
