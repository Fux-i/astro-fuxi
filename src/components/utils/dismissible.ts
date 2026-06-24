type DismissibleOptions = {
  root: HTMLElement;
  isOpen: () => boolean;
  close: () => void;
  isEnabled?: () => boolean;
};

export function dismissWhenInactive({
  root,
  isOpen,
  close,
  isEnabled = () => true,
}: DismissibleOptions) {
  const shouldDismiss = () => isEnabled() && isOpen();

  const closeWhenUnfocused = () => {
    window.setTimeout(() => {
      if (!shouldDismiss() || root.matches(":focus-within")) return;
      close();
    });
  };

  const closeWhenPointerLeavesRoot = (event: PointerEvent) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (!shouldDismiss() || root.contains(target)) return;

    close();
  };

  root.addEventListener("focusout", closeWhenUnfocused);
  document.addEventListener("pointerdown", closeWhenPointerLeavesRoot, {
    capture: true,
    passive: true,
  });
}
