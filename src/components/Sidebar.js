/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";

import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const [navOpen, setNavOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "◫", text: "피드", path: "/feed" },
    { icon: "◫", text: "작업 공간", path: "/workspace" },
    { icon: "◫", text: "카드 생성", path: "/createCard" },
    { icon: "◫", text: "내 덱", path: "/myDeck" },
    { icon: "◫", text: "데이터 필드 관리", path: "/dataFields" },
    { icon: "◫", text: "인벤토리", path: "/" },
  ];

  const handleNavClick = () => {
    setNavOpen(!navOpen);
  };

  return (
    <div className="App">
      {/* <header className="App-header">
          <div className="">
            <div className="header_icons">
                <div className=""></div>
                <div className=""></div>
                <div className=""></div>
            </div>
            <div></div>
          </div>
        </header> */}
      <main>
        {navOpen ? (
          <div className="main_container">
            <div className="main_left">
              <div className="left_bar">
                <div className="left_bar_top">
                  <div className="top_title_container">
                    <div className="top_title">
                      <div className="main_title">
                        한국 디자인 카드 아카이브
                      </div>
                      <div className="sub_title">
                        위키 스타일 참여형 지식 플랫폼
                      </div>
                    </div>
                    <div className="top_icon" onClick={handleNavClick}>
                      ◫
                    </div>
                  </div>
                  <div className="top_search_container">
                    <div className="top_search">
                      <div className="search_icon"></div>
                      <input
                        className="search_content"
                        type="text"
                        placeholder="검색..."
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="divider" />
                <div className="left_bar_menus">
                  <div className="menus_container">
                    {menuItems.map((item, index) => (
                      <div
                        key={index}
                        className={`menu_item ${
                          location.pathname === item.path ? "selected" : ""
                        }`}
                        onClick={() => navigate(item.path)}
                      >
                        <div className="menu_icon">{item.icon}</div>
                        <div className="menu_text">{item.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="divider" />
                <div className="left_bar_projects">
                  <div className="project_container">
                    <div className="project_title">최근 프로젝트</div>
                    <div className="project_card_list">
                      <div className="project_card">
                        <div className="project_card_icon">◫</div>
                        <div className="project_card_info">
                          <div className="project_card_content">
                            부산 유물 아카이브
                          </div>
                          <div className="project_card_date">2일전</div>
                        </div>
                      </div>
                      <div className="project_card"></div>
                      <div className="project_card"></div>
                      <div className="project_card"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="main_right"></div>
          </div>
        ) : (
          <div className="main_container">
            <div className="main_left_simple">
              <div className="left_bar">
                <div className="left_bar_top">
                  <div className="top_title_container">
                    <div className="top_icon" onClick={handleNavClick}>
                      ◫
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {/* <footer>
        <div className=""></div>
      </footer> */}
    </div>
  );
}

export default Sidebar;
