import { useEffect, useRef, useState, type ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
}

export default function FadeInView({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasBeenVisible = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 如果已经显示过，直接返回，不再观察
    if (hasBeenVisible.current) return;

    const checkVisibility = () => {
      if (!ref.current || hasBeenVisible.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      // 检查元素是否在视口内（使用更宽松的条件，包括部分可见）
      // 扩大检测范围，提前200px触发，避免快速滚动时错过
      const isInViewport = 
        rect.top < windowHeight + 200 && 
        rect.bottom > -200 && 
        rect.left < windowWidth + 100 &&
        rect.right > -100;
      
      if (isInViewport) {
        hasBeenVisible.current = true;
        setIsVisible(true);
        // 断开观察器
        if (observerRef.current) {
          observerRef.current.disconnect();
          observerRef.current = null;
        }
        return true; // 返回 true 表示已显示
      }
      return false;
    };

    // 立即检查一次
    checkVisibility();

    // 如果还没显示，设置 IntersectionObserver
    if (!hasBeenVisible.current && ref.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasBeenVisible.current) {
              hasBeenVisible.current = true;
              setIsVisible(true);
              // 一旦显示后，立即断开观察，确保元素永远保持可见
              if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
              }
            }
          });
        },
        { 
          threshold: 0.01, // 降低阈值，只要有一点可见就触发
          rootMargin: '100px' // 提前100px触发，避免滚动太快时错过
        }
      );
      
      observerRef.current.observe(ref.current);
    }

    // 监听滚动事件作为备用方案（防止 IntersectionObserver 在某些情况下失效）
    const handleScroll = () => {
      if (!hasBeenVisible.current) {
        checkVisibility();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const transforms = {
    up: "translateY(30px)",
    left: "translateX(-30px)",
    right: "translateX(30px)",
    none: "none",
  };

  // 一旦显示过，永远保持可见，不再应用任何动画或过渡
  if (hasBeenVisible.current) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          opacity: 1,
          transform: "none",
          transition: "none",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : transforms[direction],
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
        // 使用 pointer-events 而不是 visibility，确保元素始终占据空间
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  );
}
