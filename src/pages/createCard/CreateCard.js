/* eslint-disable react/react-in-jsx-scope */
import "./CreateCard.css";
import Select from "react-select";

function CreateCard() {
  const dataFieldOptions = [
    { value: "유물/작품", label: "유물/작품" },
    { value: "색상", label: "색상" },
    { value: "형태", label: "형태" },
    { value: "재질", label: "재질" },
    { value: "문양", label: "문양" },
    { value: "기법", label: "기법" },
    { value: "시대", label: "시대" },
    { value: "지역", label: "지역" },
    { value: "카테고리", label: "카테고리" },
    { value: "개념", label: "개념" },
  ];

  return (
    <div className="create_card_container">
      <main className="create_card_main">
        <header className="create_card_title">
          <h2 className="card_main_title">새 카드 만들기</h2>
          <p className="card_sub_title">
            필수 정보를 입력하여 카드를 생성하고, 필요한 경우 확장 데이터를
            추가할 수 있습니다.
          </p>
        </header>
        <form className="create_card_form">
          <div className="form-grid-container">
            {/* 왼쪽 컬럼 */}
            <div className="left-column">
              {/* 필수정보 */}
              <section className="require_info_section">
                <div className="require_container">
                  <header className="require_header">
                    <div className="require_icon"></div>
                    <h2>필수 정보</h2>
                  </header>
                  <div className="require_content_container">
                    <div className="require_content">
                      {/* 대표이미지 */}
                      <div className="rep_imange">
                        <div className="rep_img_title">대표이미지 *</div>
                        <div className="rep_img_container">
                          <div className="rep_img_upload">
                            <div className="rep_img_upload_text">
                              클릭하여 이미지 업로드 (다중 선택 가능)
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* 카드이름 */}
                      <div className="card_name">
                        <div className="card_name_content">
                          <div>카드 이름 *</div>
                          <input
                            type="text"
                            className="card_name_input"
                            name="cardName"
                            id="cardName"
                          ></input>
                        </div>
                      </div>

                      {/* 데이터 필드  */}
                      <div className="select_data_field">
                        <div>데이터 필드 *</div>
                        <Select
                          className="data_field_select_wrapper"
                          classNamePrefix="data_field_select"
                          defaultValue={dataFieldOptions[0]}
                          options={dataFieldOptions}
                          isSearchable={false}
                          placeholder="선택하세요"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="extend_data_section">
                <div className="extend_data_container">
                  <header className="extend_data_header">
                    <div className="extend_data_icon">+</div>
                    <h2>확장 데이터 추가</h2>
                    <p>(선택사항)</p>
                  </header>
                  <div className="extend_content">
                    <div className="extend_data_list">
                      <div className="extend_data_item">
                        <div className="extend_data_item_cotainer">
                          <div className="extend_default_info_icon"></div>
                          <p>기본 정보 추가</p>
                          <div> &gt; </div>
                        </div>
                      </div>
                      <div className="extend_data_item">
                        <div className="extend_data_item_cotainer">
                          <div className="extend_link_data_icon"></div>
                          <p>종속 데이터 연결</p>
                          <div> &gt; </div>
                        </div>
                      </div>
                      <div className="extend_data_item">
                        <div className="extend_data_item_cotainer">
                          <div className="extend_unlink_data_icon"></div>
                          <p>비종속 데이터 첨부</p>
                          <div> &gt; </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="right-column">
              <section className="preview_section">
                <div className="preview_container">
                  <header className="preview_header">
                    <div className="create_card_section_icon"></div>
                    <h2>미리보기</h2>
                  </header>
                  <div className="preview_content_container">
                    <div className="preview_content">
                      <div className="preview_img">
                        <input type="image"></input>
                      </div>
                      <div className="preview_img_title">
                        카드 이름 입력 필요
                      </div>
                      <div className="preview_img_date">
                        20250. 11. 1 오후 2:28:30
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <button>카드 저장</button>
        </form>
      </main>
    </div>
  );
}

export default CreateCard;
