import { Component } from 'react';
import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data } from 'renderer/pages/MasterPage';

export interface InsurancePolicies {
  id?: string; 
  policy_code: string;
  project_id: string;
  company: string;
  policy_details: string;
  comment: string;
  start_date: string;
  end_date: string;
}

interface Props {
  insurancePolicies?: InsurancePolicies;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data) => void;
  positions: Resource[];
  projects: Resource[];
  subcontracts: Resource[]
}

interface State {
  insurancePolicies: InsurancePolicies;
}

export default class InsurancePoliciesForm extends Component<Props, State> {
  get defaultState() {
    return {
      InsurancePolicies: this.props.insurancePolicies ?? {
        policy_code: '',
        project_id: undefined,
        company: '',
        policy_details: '',
        comment: '',
        start_date: '',
        end_date: '',
      }
    };
  }

  /*constructor(props: Props) {
    //super(props);
    //this.defaultState = this.state;
    //this.state = this.defaultState;
  }*/

  /*componentDidUpdate(prevProps: Props) {
    if (!!prevProps.insurancePolicies !== !!this.props.insurancePolicies) {
      this.setState(this.defaultState);
    }
  }*/
  
  
  render() {
    const {projects} = this.props;
    const {insurancePolicies} = this.state;
    return (
      <MasterForm<State['insurancePolicies']>
        isEditing={!!insurancePolicies}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            insurancePolicies: {
              ...this.state.insurancePolicies,
              [key]: value
            }
          })
        }}
        onFileChange={}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.insurancePolicies as unknown as Record<string, unknown>)}
      >
      <div>
        <div>
         <input name="policy_code" type="text" value={this.state.insurancePolicies.policy_code}/>
       </div>
        <div>
         <input name="project_id" type="text" value={this.state.insurancePolicies.project_id}/>
         {(MasterForm.renderSelectOptions(projects, !this.state.insurancePolicies.project_id))}
        </div>
        <div>
         <input name="company" type="text" value={this.state.insurancePolicies.company}/>
        </div>
        <div>
         <input name="policy_details" type="text" value={this.state.insurancePolicies.policy_details}/>
       </div>
        <div>
          <input name="comment" type="text" value={this.state.insurancePolicies.comment}/>
       </div>
        <div>
          <input name="start_date" type="date" value={this.state.insurancePolicies.start_date}/>
        </div>
        <div>
         <input name="end_date" type="date" value={this.state.insurancePolicies.end_date}/>
        </div>
      </div>
      </MasterForm>
    );
  }
}
