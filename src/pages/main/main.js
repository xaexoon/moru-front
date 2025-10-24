/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";

import "./main.css";

function Main() {
  const [navOpen, setNavOpen] = useState(true);

  console.log(navOpen);

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
                    <div className="menu_item">
                      <div className="menu_icon"></div>
                      <div className="menu_text">피드</div>
                    </div>
                    <div className="menu_item">
                      <div className="menu_icon"></div>
                      <div className="menu_text">작업 공간</div>
                    </div>
                    <div className="menu_item">
                      <div className="menu_icon"></div>
                      <div className="menu_text">카드 생성</div>
                    </div>
                    <div className="menu_item">
                      <div className="menu_icon"></div>
                      <div className="menu_text">내 덱</div>
                    </div>
                    <div className="menu_item">
                      <div className="menu_icon"></div>
                      <div className="menu_text">데이터 필드 관리</div>
                    </div>
                    <div className="menu_item">
                      <div className="menu_icon"></div>
                      <div className="menu_text">인벤토리</div>
                    </div>
                  </div>
                </div>
                <div className="divider" />
                <div className="left_bar_projects">
                  <div className="project_container">
                    <div className="project_title">최근 프로젝트</div>
                    <div className="project_card_list">
                      <div className="project_card"></div>
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
      <footer>
        <div className=""></div>
      </footer>
    </div>
  );
}

export default Main;
