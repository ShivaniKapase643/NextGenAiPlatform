import React from 'react';

type SvgProps = React.SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 20, children, ...props }: SvgProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {children}
    </svg>
  );
}

export function XMarkIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M6 18L18 6" />
    </Svg>
  );
}

export function SearchIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </Svg>
  );
}

export function LinkIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Svg>
  );
}

export function LinkSolidIcon(p: SvgProps) {
  return (
    <Svg {...p} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H16.5v4.25a.75.75 0 0 1-1.5 0V8.5H10.75a.75.75 0 0 1 0-1.5H15V2.75A.75.75 0 0 1 15.75 2ZM9 12.75A.75.75 0 0 0 7.5 12v-1.25H3.75a.75.75 0 0 0 0 1.5H7.5V16a.75.75 0 0 0 1.5 0v-3.25ZM3.879 17.121a3 3 0 1 0 4.243 4.243l2.122-2.122-1.06-1.06-2.122 2.12a1.5 1.5 0 1 1-2.122-2.12l2.121-2.122-1.06-1.06-2.122 2.121ZM17.121 3.879a3 3 0 1 0-4.243 4.243l-2.121 2.12 1.06 1.061 2.122-2.12a1.5 1.5 0 1 1 2.121 2.12l-2.12 2.121 1.06 1.061 2.121-2.121a3 3 0 0 0 0-4.243l-.003-.003Z"
      />
    </Svg>
  );
}

export function Cube16SolidIcon(p: SvgProps) {
  return (
    <Svg {...p} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
    </Svg>
  );
}

export function Cog8ToothIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </Svg>
  );
}

export function ChevronUpIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </Svg>
  );
}

export function ChevronUpSolidIcon(p: SvgProps) {
  return (
    <Svg {...p} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
      />
    </Svg>
  );
}

export function ChevronRightIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

export function ChevronLeftIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

export function ChevronDownIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

export function ChartPieIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
      <path d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
    </Svg>
  );
}

export function ArrowTrendingUpIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </Svg>
  );
}

export function ArrowPathIcon(p: SvgProps) {
  return (
    <Svg {...p} stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </Svg>
  );
}

/* Convenience map for dynamic lookup */
const ICON_MAP = {
  'x-mark': XMarkIcon,
  'search': SearchIcon,
  'link': LinkIcon,
  'link-solid': LinkSolidIcon,
  'cube-16-solid': Cube16SolidIcon,
  'cog-8-tooth': Cog8ToothIcon,
  'chevron-up': ChevronUpIcon,
  'chevron-up-solid': ChevronUpSolidIcon,
  'chevron-right': ChevronRightIcon,
  'chevron-left': ChevronLeftIcon,
  'chevron-down': ChevronDownIcon,
  'chart-pie': ChartPieIcon,
  'arrow-trending-up': ArrowTrendingUpIcon,
  'arrow-path': ArrowPathIcon,
} as const;

export type IconName = keyof typeof ICON_MAP;

export function SvgIcon({ name, ...props }: SvgProps & { name: IconName }) {
  const Icon = ICON_MAP[name];
  return <Icon {...props} />;
}
