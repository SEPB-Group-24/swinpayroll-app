import './style.css';

const Tabs = () => {
  return (
    <div className="Tabs">
      <div className="tabs">
        <div className="tab employeeTab">Employee</div>
        <div className="tab subContractorTab">Sub Contractor</div>
        <div className="tab projectTab">Project</div>
        <div className="tab insuranceTab">Insurance</div>
        <div className="tab positionTab">Position</div>
      </div>

      <div className="container">
        <div className="containerStripe" />
        <div className="containerTabs">
          <div className="containerTab viewTab">View</div>
          <div className="containerTab editTab">Edit</div>
        </div>
        <div className="containerContent">
          <div className="containerFormRow">
            <div className="formField">
              <label>
                Field:&nbsp;
                <input type="text" />
              </label>
            </div>
            <div className="formField">
              <label>
                Field:&nbsp;
                <input type="text" />
              </label>
            </div>
          </div>
          <div className="containerButtons">
            <div className="containerButton">CLOSE</div>
            <div className="containerButton">ADD</div>
            <div className="containerButton">DELETE</div>
            <div className="buttonsPrevNext">
              <div className="buttonPrevNext containerButton prevButton">
                PREV
              </div>
              <div className="buttonPrevNext containerButton">NEXT</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
