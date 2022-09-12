import { Component } from 'react';
import { FetchApi } from 'renderer/components/Auth';
import MasterForm, { Resource } from 'renderer/components/MasterForm';
import { Data, Files } from 'renderer/pages/MasterPage';

export interface InsurancePolicy {
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
  insurancePolicy?: InsurancePolicy;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data, files: Files) => void;
  projects: Resource[];
}

interface State {
  insurancePolicy: InsurancePolicy;
  files: Files;
}

export default class InsurancePolicyForm extends Component<Props, State> {
  get defaultState() {
    return {
      insurancePolicy: this.props.insurancePolicy ?? {
        policy_code: '',
        project_id: undefined,
        company: '',
        policy_details: '',
        comment: '',
        start_date: '',
        end_date: '',
      },
      files: {},
    };
  }
  
  render() {
    const { projects } = this.props;
    const { insurancePolicy } = this.state;
    return (
      <MasterForm<State['insurancePolicy']>
        isEditing={!!insurancePolicy}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            insurancePolicy: {
              ...this.state.insurancePolicy,
              [key]: value
            }
          })
        }}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.insurancePolicy as unknown as Record<string, unknown>, this.state.files)}
      >
      <div>
        <div>
         <input name="policy_code" type="text" value={this.state.insurancePolicy.policy_code}/>
       </div>
        <div>
         <select name="project_id" value={insurancePolicy.project_id}>
          {MasterForm.renderSelectOptions(projects, true)}
         </select>
        </div>
        <div>
         <input name="company" type="text" value={this.state.insurancePolicy.company}/>
        </div>
        <div>
         <input name="policy_details" type="text" value={this.state.insurancePolicy.policy_details}/>
       </div>
        <div>
          <input name="comment" type="text" value={this.state.insurancePolicy.comment}/>
       </div>
        <div>
          <input name="start_date" type="date" value={this.state.insurancePolicy.start_date}/>
        </div>
        <div>
         <input name="end_date" type="date" value={this.state.insurancePolicy.end_date}/>
        </div>
      </div>
      </MasterForm>
    );
  }
}
