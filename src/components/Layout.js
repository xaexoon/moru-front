/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import Sidebar from "./Sidebar";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="App">
      <main>
        <div className="main_container">
          <Sidebar />
          <div className="main_right">
            {children} {/* 페이지 내용이 여기 들어감 */}
          </div>
        </div>
      </main>
      <footer>
        <div className=""></div>
      </footer>
    </div>
  );
}

export default Layout;
