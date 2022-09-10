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
  InsurancePolicy?: InsurancePolicy;
  fetchApi: FetchApi;
  onClose: () => void;
  onDelete: () => void;
  onSubmit: (data: Data, files: Files) => void;
  projects: Resource[];
}

interface State {
  InsurancePolicy: InsurancePolicy;
  files: Files;
}

export default class InsurancePolicyForm/index.tsx extends Component<Props, State> {
  get defaultState() {
    return {
      insurancePolicy: this.props.insurancePolicy ?? {
        policyCode: '',
        projectId: undefined,
        company: '',
        policyDetails: '',
        comment: '',
        startDate: '',
        endDate: ''
      },
      files: {}
    };
  }
  
  render() {
    const {projects} = this.props;
    const {InsurancePolicy} = this.state;
    return (
      <MasterForm<State['InsurancePolicy']>
        isEditing={!!InsurancePolicy}
        onChange={(key, value) => {
          if (!key) {
            return;
          }

          this.setState({
            InsurancePolicy: {
              ...this.state.InsurancePolicy,
              [key]: value
            }
          })
        }}
        onFileChange={(key, value) => this.setState({
          files: {
            ...this.state.files,
            [key]: value
          }
        })}
        onClose={this.props.onClose}
        onDelete={this.props.onDelete}
        onSubmit={() => this.props.onSubmit(this.state.InsurancePolicy as unknown as Record<string, unknown>, this.state.files)}
      >
      <div>
        <div>
         <input name="policy_code" type="text" value={this.state.InsurancePolicy.policy_code}/>
       </div>
        <div>
         <input name="project_id" type="text" value={this.state.InsurancePolicy.project_id}/>
         {MasterForm.renderSelectOptions(projects, !this.state.InsurancePolicy.project_id)}
        </div>
        <div>
         <input name="company" type="text" value={this.state.InsurancePolicy.company}/>
        </div>
        <div>
         <input name="policy_details" type="text" value={this.state.InsurancePolicy.policy_details}/>
       </div>
        <div>
          <input name="comment" type="text" value={this.state.InsurancePolicy.comment}/>
       </div>
        <div>
          <input name="start_date" type="date" value={this.state.InsurancePolicy.start_date}/>
        </div>
        <div>
         <input name="end_date" type="date" value={this.state.InsurancePolicy.end_date}/>
        </div>
      </div>
      </MasterForm>
    );
  }
}
