import { getInitials, getAvatarColor, type User } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-2xl',
};

const statusSizeClasses = {
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-5 h-5 border-[3px]',
};

export default function ChatAvatar({ user, size = 'md', showStatus = false, className }: AvatarProps) {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn('rounded-full flex items-center justify-center font-semibold text-primary-foreground', sizeClasses[size])}
        style={{ backgroundColor: getAvatarColor(user.id) }}
      >
        {getInitials(user.name)}
      </div>
      {showStatus && user.online && (
        <div
          className={cn(
            'absolute bottom-0 right-0 rounded-full bg-online border-background online-pulse',
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
}
