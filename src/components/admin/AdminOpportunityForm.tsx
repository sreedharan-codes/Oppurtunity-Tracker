import React, { useState } from 'react';
import { Opportunity, OpportunityType, OpportunityMode, OpportunityDifficulty, OpportunityPublishStatus } from '../../types';
import { GlassModal } from '../ui/GlassModal';
import { GlassInput } from '../ui/GlassInput';
import { GlassButton } from '../ui/GlassButton';
import { useToast } from '../../context/ToastContext';
import { opportunityService } from '../../firebase/services';
import { Check } from 'lucide-react';

interface AdminOpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityToEdit?: Opportunity | null;
  onSaved: (opportunity: Opportunity) => void;
}

export const AdminOpportunityForm: React.FC<AdminOpportunityFormProps> = ({
  isOpen,
  onClose,
  opportunityToEdit,
  onSaved,
}) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => ({
    title: opportunityToEdit?.title || '',
    organization: opportunityToEdit?.organization || '',
    organizationLogo: opportunityToEdit?.organizationLogo || '',
    description: opportunityToEdit?.description || '',
    type: opportunityToEdit?.type || ('Internship' as OpportunityType),
    skills: opportunityToEdit?.skills.join(', ') || '',
    eligibility: opportunityToEdit?.eligibility || '',
    location: opportunityToEdit?.location || '',
    mode: opportunityToEdit?.mode || ('Hybrid' as OpportunityMode),
    difficulty: opportunityToEdit?.difficulty || ('Intermediate' as OpportunityDifficulty),
    deadline: opportunityToEdit?.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    applicationUrl: opportunityToEdit?.applicationUrl || '',
    stipendOrPrize: opportunityToEdit?.stipendOrPrize || '',
    status: opportunityToEdit?.status || ('published' as OpportunityPublishStatus),
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.organization) {
      error('Validation Error', 'Title and Organization are required.');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        organization: formData.organization,
        organizationLogo: formData.organizationLogo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
        description: formData.description,
        type: formData.type,
        skills: skillsArray.length > 0 ? skillsArray : ['Software Engineering'],
        eligibility: formData.eligibility || 'Open to all enrolled university students.',
        location: formData.location || 'Remote / Hybrid',
        mode: formData.mode,
        difficulty: formData.difficulty,
        deadline: formData.deadline,
        applicationUrl: formData.applicationUrl || 'https://careers.google.com',
        postedAt: opportunityToEdit?.postedAt || new Date().toISOString().split('T')[0],
        status: formData.status,
        stipendOrPrize: formData.stipendOrPrize || 'Competitive',
      };

      let result: Opportunity;
      if (opportunityToEdit) {
        result = await opportunityService.updateOpportunity(opportunityToEdit.id, payload);
        success('Opportunity updated', `"${result.title}" has been updated.`);
      } else {
        result = await opportunityService.createOpportunity(payload);
        success('Opportunity created', `"${result.title}" has been published.`);
      }

      onSaved(result);
      onClose();
    } catch (err: any) {
      error('Failed to save opportunity', err?.message || 'Error communicating with Firestore.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={opportunityToEdit ? 'Edit Opportunity' : 'Create New Opportunity'}
      description="Publish internships, hackathons, certifications, or workshops to the platform."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput
            label="Opportunity Title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. AI Research Internship"
            required
          />
          <GlassInput
            label="Organization Name"
            value={formData.organization}
            onChange={e => setFormData({ ...formData, organization: e.target.value })}
            placeholder="e.g. Google, Apple, Microsoft"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput
            label="Organization Logo URL"
            value={formData.organizationLogo}
            onChange={e => setFormData({ ...formData, organizationLogo: e.target.value })}
            placeholder="https://..."
          />
          <GlassInput
            label="Application URL"
            value={formData.applicationUrl}
            onChange={e => setFormData({ ...formData, applicationUrl: e.target.value })}
            placeholder="https://careers..."
            required
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400">Category</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as OpportunityType })}
              className="glass-input w-full px-3 py-2 text-xs rounded-xl text-neutral-900 dark:text-neutral-100"
            >
              <option value="Internship">Internship</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Certification">Certification</option>
              <option value="Competition">Competition</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400">Format Mode</label>
            <select
              value={formData.mode}
              onChange={e => setFormData({ ...formData, mode: e.target.value as OpportunityMode })}
              className="glass-input w-full px-3 py-2 text-xs rounded-xl text-neutral-900 dark:text-neutral-100"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400">Experience</label>
            <select
              value={formData.difficulty}
              onChange={e => setFormData({ ...formData, difficulty: e.target.value as OpportunityDifficulty })}
              className="glass-input w-full px-3 py-2 text-xs rounded-xl text-neutral-900 dark:text-neutral-100"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-400">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as OpportunityPublishStatus })}
              className="glass-input w-full px-3 py-2 text-xs rounded-xl text-neutral-900 dark:text-neutral-100 font-semibold"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput
            label="Location"
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. San Francisco, CA / Remote"
          />
          <GlassInput
            label="Application Deadline"
            type="date"
            value={formData.deadline}
            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <GlassInput
            label="Skills (Comma-separated)"
            value={formData.skills}
            onChange={e => setFormData({ ...formData, skills: e.target.value })}
            placeholder="React, TypeScript, Python, AI/ML"
            required
          />
          <GlassInput
            label="Stipend / Prize Pool"
            value={formData.stipendOrPrize}
            onChange={e => setFormData({ ...formData, stipendOrPrize: e.target.value })}
            placeholder="e.g. $8,500 / month or $25,000 Prize"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-400 block mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="glass-input w-full p-3 text-xs rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500"
            placeholder="Detailed description of responsibilities and scope..."
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-neutral-400 block mb-1.5">
            Eligibility Criteria
          </label>
          <textarea
            value={formData.eligibility}
            onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
            rows={2}
            className="glass-input w-full p-3 text-xs rounded-xl text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500"
            placeholder="e.g. 2nd & 3rd year undergraduate engineering students..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
          <GlassButton type="button" variant="secondary" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            type="submit"
            variant="primary"
            loading={loading}
            icon={<Check className="w-4 h-4" />}
          >
            {opportunityToEdit ? 'Save Changes' : 'Publish Opportunity'}
          </GlassButton>
        </div>
      </form>
    </GlassModal>
  );
};
