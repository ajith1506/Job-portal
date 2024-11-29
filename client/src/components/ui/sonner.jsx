import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      position="top-center" // Place toasts at the top center
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group-[.toaster]:bg-blue-500 group-[.toaster]:text-white group-[.toaster]:border-blue-700 group-[.toaster]:shadow-lg text-xl", // Increase text size for main toast
          description: "group-[.toast]:text-gray-200 text-lg", // Increase text size for description
          actionButton:
            "group-[.toast]:bg-green-500 group-[.toast]:text-white text-base",
          cancelButton:
            "group-[.toast]:bg-red-500 group-[.toast]:text-white text-base",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
