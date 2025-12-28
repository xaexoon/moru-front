import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGetMyInfo } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const [navOpen, setNavOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({
    create: true,
    archive: true,
  });
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  // 내 정보 조회
  const { data: userInfo } = useGetMyInfo({
    enabled: isAuthenticated,
  });

  const user = userInfo?.data?.data;

  // 랜덤 배경색 생성 (사용자별로 고정되도록 useMemo 사용)
  const profileBgColor = useMemo(() => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    // 사용자 이름 기반으로 색상 선택 (같은 사용자는 항상 같은 색)
    if (user?.nickname) {
      const index = user.nickname.charCodeAt(0) % colors.length;
      return colors[index];
    }
    return colors[Math.floor(Math.random() * colors.length)];
  }, [user?.nickname]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const menuStructure = [
    {
      type: "category",
      key: "feed",
      title: "피드",
      items: [{ icon: "◫", text: "피드", path: "/feed" }],
    },
    {
      type: "category",
      key: "create",
      title: "크리에이트",
      items: [
        { icon: "◫", text: "카드 생성", path: "/createCard" },
        // { icon: "◫", text: "내 덱 관리", path: "/myDeck" },
        { icon: "◫", text: "데이터 필드 관리", path: "/dataFields" },
      ],
    },
    {
      type: "category",
      key: "archive",
      title: "내 아카이브",
      items: [
        { icon: "◫", text: "프로필", path: "/profile" },
        // { icon: "◫", text: "내 카드 컬렉션", path: "/myCards" },
        { icon: "◫", text: "내 덱", path: "/myDeck" },
        { icon: "◫", text: "인벤토리", path: "/inventory" },
      ],
    },
  ];

  const handleNavClick = () => {
    setNavOpen(!navOpen);
  };

  const renderMenuItem = (item, index) => (
    <div
      key={index}
      className={`flex items-center gap-5 w-full h-10 rounded-[10px] px-5 cursor-pointer
        ${location.pathname === item.path ? "bg-[#ededed]" : "hover:bg-[#f5f5f5]"}`}
      onClick={() => navigate(item.path)}
    >
      <div>{item.icon}</div>
      <div>{item.text}</div>
    </div>
  );

  const renderCategory = (category, index) => (
    <div key={index} className="flex flex-col">
      <div
        className="flex items-center justify-between w-full h-10 rounded-[10px] px-5 cursor-pointer hover:bg-[#f5f5f5]"
        onClick={() => toggleCategory(category.key)}
      >
        <span className="text-sm text-gray-500 font-medium">{category.title}</span>
        <span className="text-lg text-gray-400 transition-transform duration-200">
          {expandedCategories[category.key] ? "▴" : "▾"}
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
          ${expandedCategories[category.key] ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
      >
        {category.items.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-5 w-full h-10 rounded-[10px] pl-10 pr-5 cursor-pointer
              ${location.pathname === item.path ? "bg-[#ededed]" : "hover:bg-[#f5f5f5]"}`}
            onClick={() => navigate(item.path)}
          >
            <div className="text-gray-400">{item.icon}</div>
            <div>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return navOpen ? (
    <div className="w-full h-full p-[30px] flex flex-col gap-5">
      {/* 상단 타이틀 */}
      <div className="flex flex-col gap-5">
        <div className="flex justify-between gap-5">
          <div className="flex flex-col">
            <div className="text-base font-semibold text-black">
              한국 디자인 카드 아카이브
            </div>
            <div className="text-xs text-gray-500">
              위키 스타일 참여형 지식 플랫폼
            </div>
          </div>
          <div className="cursor-pointer" onClick={handleNavClick}>
            ◫
          </div>
        </div>

        {/* 검색 */}
        <div className="w-full bg-[#eaeaea] h-[30px] flex items-center rounded-[5px]">
          <div className="flex items-center justify-center w-[30px] h-full">
            {/* 검색 아이콘 */}
          </div>
          <input
            type="text"
            placeholder="검색..."
            className="flex-1 bg-transparent border-none h-full px-2.5 focus:outline-none"
          />
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-[#ededed] -mx-[30px]" />

      {/* 로그인 정보 */}
      <div
        className="flex w-full h-[80px] border rounded-[5px] items-center cursor-pointer hover:bg-gray-50"
        onClick={() => navigate("/profile")}
      >
        <div className="flex flex-row w-[60px] h-[60px] items-center justify-center mr-4 ml-2">
          <div
            className={`flex items-center justify-center w-[50px] h-[50px] rounded-full ${profileBgColor} text-white font-bold`}
          >
            {user?.nickname?.charAt(0) || "?"}
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <span className="font-medium">{user?.nickname || "로그인 필요"}</span>
          <span className="text-[8pt] text-gray-500">
            {user?.email || "이메일 없음"}
          </span>
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-[#ededed] -mx-[30px]" />

      {/* 메뉴 */}
      <div className="flex flex-col gap-1">
        {menuStructure.map((item, index) =>
          item.type === "item"
            ? renderMenuItem(item, index)
            : renderCategory(item, index)
        )}
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex justify-center p-[30px]">
      <div className="cursor-pointer" onClick={handleNavClick}>
        ◫
      </div>
    </div>
  );
}

export default Sidebar;