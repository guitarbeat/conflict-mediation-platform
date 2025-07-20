"use client";

import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import {
  createMenuItemComponent,
  createMenuCheckboxItemComponent,
  createMenuRadioItemComponent,
  createMenuLabelComponent,
  createMenuSeparatorComponent,
  createMenuShortcutComponent,
  createMenuSubTriggerComponent,
  createMenuSubContentComponent,
} from "./menu-base.jsx";

// * Create shared menu components using the base factory functions
const ContextMenuItem = createMenuItemComponent(
  ContextMenuPrimitive.Item,
  "context-menu-item"
);

const ContextMenuCheckboxItem = createMenuCheckboxItemComponent(
  ContextMenuPrimitive.CheckboxItem,
  "context-menu-checkbox-item",
  ContextMenuPrimitive.ItemIndicator,
  CheckIcon
);

const ContextMenuRadioItem = createMenuRadioItemComponent(
  ContextMenuPrimitive.RadioItem,
  "context-menu-radio-item",
  ContextMenuPrimitive.ItemIndicator,
  CircleIcon
);

const ContextMenuLabel = createMenuLabelComponent(
  ContextMenuPrimitive.Label,
  "context-menu-label"
);

const ContextMenuSeparator = createMenuSeparatorComponent(
  ContextMenuPrimitive.Separator,
  "context-menu-separator"
);

const ContextMenuShortcut = createMenuShortcutComponent(
  "context-menu-shortcut"
);

const ContextMenuSubTrigger = createMenuSubTriggerComponent(
  ContextMenuPrimitive.SubTrigger,
  "context-menu-sub-trigger",
  ChevronRightIcon
);

const ContextMenuSubContent = createMenuSubContentComponent(
  ContextMenuPrimitive.SubContent,
  "context-menu-sub-content",
  "--radix-context-menu-content-transform-origin"
);

function ContextMenu({ ...props }) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ ...props }) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  );
}

function ContextMenuGroup({ ...props }) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  );
}

function ContextMenuPortal({ ...props }) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  );
}

function ContextMenuSub({ ...props }) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />;
}

function ContextMenuRadioGroup({ ...props }) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  );
}

function ContextMenuContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};
