'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Json } from '@/lib/types';
import { localized } from '@/lib/i18n';
import { AutoTranslateAllButton } from './translation-button';
import { AdminSubmitButton } from './admin-submit-button';

type Kind = 'service' | 'project' | 'blog';
type Action = (formData: FormData) => Promise<void>;

function value(data: Json | undefined, locale: 'en' | 'km' | 'zh') {
  return localized(data, locale);
}

export function ContentForm({ kind, action, item }: { kind: Kind; action: Action; item?: Record<string, unknown> }) {
  const [activeTab, setActiveTab] = useState<'en' | 'km' | 'zh' | 'all'>('en');

  const title = item?.title as Json | undefined;
  const description = item?.description as Json | undefined;
  const content = item?.content as Json | undefined;
  const excerpt = item?.excerpt as Json | undefined;
  const returnPath = `/admin/${kind === 'blog' ? 'blog' : kind + 's'}`;

  return (
    <form action={action} encType="multipart/form-data" className="wp-editor-form">
      <input type="hidden" name="id" value={String(item?.id ?? '')} />

      {/* Main WordPress 2-Column Layout */}
      <div className="wp-editor-grid">
        
        {/* Left Column: Main Editor Column */}
        <div className="wp-editor-main">
          
          {/* Top Bar: Language Tabs & Quick Auto Translate */}
          <div className="wp-lang-bar">
            <div className="wp-lang-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'en'}
                className={`wp-lang-tab ${activeTab === 'en' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('en')}
              >
                <span className="wp-flag">🇬🇧</span> English
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'km'}
                className={`wp-lang-tab ${activeTab === 'km' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('km')}
              >
                <span className="wp-flag">🇰🇭</span> Khmer
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'zh'}
                className={`wp-lang-tab ${activeTab === 'zh' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('zh')}
              >
                <span className="wp-flag">🇨🇳</span> Chinese
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'all'}
                className={`wp-lang-tab ${activeTab === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span className="wp-flag">🌐</span> All Languages
              </button>
            </div>
            <AutoTranslateAllButton />
          </div>

          {/* WordPress Title Input Box */}
          <div className="wp-title-block">
            {(['en', 'km', 'zh'] as const).map((locale) => (
              <div key={locale} className={`wp-field-locale ${activeTab === 'all' || activeTab === locale ? 'is-visible' : 'is-hidden'}`}>
                {activeTab === 'all' && <span className="wp-locale-tag">{locale.toUpperCase()}</span>}
                <input
                  name={`title_${locale}`}
                  defaultValue={value(title, locale)}
                  placeholder={locale === 'en' ? `Add ${kind} title in English…` : `Title in ${locale === 'km' ? 'Khmer' : 'Chinese'}…`}
                  className="wp-title-input"
                  required={locale === 'en'}
                />
              </div>
            ))}
          </div>

          {/* Permalink / Slug Bar */}
          <div className="wp-slug-bar">
            <span className="wp-slug-label">Permalink:</span>
            <span className="wp-slug-prefix">/{kind === 'blog' ? 'blog' : kind + 's'}/</span>
            <input
              name="slug"
              defaultValue={String(item?.slug ?? '')}
              placeholder="auto-generated-from-title"
              className="wp-slug-input"
            />
          </div>

          {/* Excerpt / Short Description Meta Box */}
          <div className="wp-metabox">
            <div className="wp-metabox-header">
              <h3>{kind === 'blog' ? 'Excerpt' : 'Short Description'}</h3>
              <small>Brief overview used in listing cards and search previews</small>
            </div>
            <div className="wp-metabox-content">
              {(['en', 'km', 'zh'] as const).map((locale) => (
                <div key={locale} className={`wp-field-locale ${activeTab === 'all' || activeTab === locale ? 'is-visible' : 'is-hidden'}`}>
                  {activeTab === 'all' && <span className="wp-locale-tag">{locale.toUpperCase()}</span>}
                  <textarea
                    name={kind === 'blog' ? `excerpt_${locale}` : `description_${locale}`}
                    defaultValue={value(kind === 'blog' ? excerpt : description, locale)}
                    rows={3}
                    placeholder={`Write ${kind === 'blog' ? 'excerpt' : 'short description'} in ${locale.toUpperCase()}…`}
                    className="wp-textarea"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Body Content Editor Box */}
          <div className="wp-metabox">
            <div className="wp-metabox-header">
              <h3>Body Content</h3>
              <small>Main text and HTML content for this {kind}</small>
            </div>
            <div className="wp-metabox-content">
              {(['en', 'km', 'zh'] as const).map((locale) => (
                <div key={locale} className={`wp-field-locale ${activeTab === 'all' || activeTab === locale ? 'is-visible' : 'is-hidden'}`}>
                  {activeTab === 'all' && <span className="wp-locale-tag">{locale.toUpperCase()}</span>}
                  <textarea
                    name={`content_${locale}`}
                    defaultValue={value(content, locale)}
                    rows={12}
                    placeholder={`Write content body in ${locale.toUpperCase()}…`}
                    className="wp-textarea wp-content-textarea"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* WordPress Yoast-Style SEO Meta Box */}
          <div className="wp-metabox wp-seo-metabox">
            <details className="wp-details">
              <summary className="wp-details-summary">
                <span className="wp-seo-icon">🔍</span> Search Engine Optimization (SEO) & Accessibility
              </summary>
              <div className="wp-metabox-content wp-seo-content">
                <div className="wp-field-group">
                  <label className="wp-label">SEO Meta Title</label>
                  {(['en', 'km', 'zh'] as const).map((locale) => (
                    <div key={locale} className={`wp-field-locale ${activeTab === 'all' || activeTab === locale ? 'is-visible' : 'is-hidden'}`}>
                      {activeTab === 'all' && <span className="wp-locale-tag">{locale.toUpperCase()}</span>}
                      <input
                        name={`seo_title_${locale}`}
                        defaultValue={value(item?.seo_title as Json | undefined, locale)}
                        className="wp-input"
                        placeholder="SEO Title Tag"
                      />
                    </div>
                  ))}
                </div>

                <div className="wp-field-group">
                  <label className="wp-label">SEO Meta Description</label>
                  {(['en', 'km', 'zh'] as const).map((locale) => (
                    <div key={locale} className={`wp-field-locale ${activeTab === 'all' || activeTab === locale ? 'is-visible' : 'is-hidden'}`}>
                      {activeTab === 'all' && <span className="wp-locale-tag">{locale.toUpperCase()}</span>}
                      <textarea
                        name={`seo_description_${locale}`}
                        defaultValue={value(item?.seo_description as Json | undefined, locale)}
                        rows={3}
                        className="wp-textarea"
                        placeholder="Search result snippet summary…"
                      />
                    </div>
                  ))}
                </div>

                <div className="wp-field-group">
                  <label className="wp-label">Featured Image Alt Text</label>
                  {(['en', 'km', 'zh'] as const).map((locale) => (
                    <div key={locale} className={`wp-field-locale ${activeTab === 'all' || activeTab === locale ? 'is-visible' : 'is-hidden'}`}>
                      {activeTab === 'all' && <span className="wp-locale-tag">{locale.toUpperCase()}</span>}
                      <input
                        name={`image_alt_${locale}`}
                        defaultValue={value(item?.image_alt as Json | undefined, locale)}
                        className="wp-input"
                        placeholder="Describe image for screen readers…"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>

        </div>

        {/* Right Column: WordPress Document Settings Sidebar */}
        <div className="wp-sidebar">
          
          {/* Publish Box */}
          <div className="wp-sidebar-box wp-publish-box">
            <div className="wp-sidebar-header">
              <h3>Publish Status</h3>
              <span className={`wp-status-badge ${Boolean(item?.is_published) ? 'is-published' : 'is-draft'}`}>
                {Boolean(item?.is_published) ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="wp-sidebar-body">
              <label className="wp-checkbox-label">
                <input type="checkbox" name="is_published" defaultChecked={Boolean(item?.is_published)} />
                <span>Publish publicly on website</span>
              </label>

              {kind === 'project' && (
                <label className="wp-checkbox-label">
                  <input type="checkbox" name="is_featured" defaultChecked={Boolean(item?.is_featured)} />
                  <span>Feature on home page grid</span>
                </label>
              )}

              {kind !== 'blog' && (
                <div className="wp-field-group">
                  <label className="wp-label">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    min="0"
                    defaultValue={String(item?.display_order ?? 0)}
                    className="wp-input"
                  />
                  <small className="wp-hint">Lower numbers appear first</small>
                </div>
              )}
            </div>
            <div className="wp-sidebar-footer">
              <Link href={returnPath} className="wp-cancel-link">Cancel</Link>
              <AdminSubmitButton>Publish / Update</AdminSubmitButton>
            </div>
          </div>

          {/* Featured Image & Gallery Box */}
          <div className="wp-sidebar-box">
            <div className="wp-sidebar-header">
              <h3>Featured Image</h3>
            </div>
            <div className="wp-sidebar-body">
              {typeof item?.cover_image === 'string' && item.cover_image && (
                <div className="wp-image-preview">
                  <img
                    src={`/storage/${item.cover_image}`}
                    alt="Cover preview"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="wp-image-hint">Current Cover Image</span>
                </div>
              )}
              <div className="wp-field-group">
                <label className="wp-label">{Boolean(item?.cover_image) ? 'Replace Image' : 'Set Cover Image'}</label>
                <input type="file" name="cover_image" accept="image/jpeg,image/png,image/webp" className="wp-file-input" />
                <small className="wp-hint">JPG, PNG or WebP up to 10 MB</small>
              </div>

              {kind !== 'blog' && (
                <div className="wp-field-group wp-gallery-group">
                  <label className="wp-label">Gallery Images</label>
                  <input type="file" name="gallery_images" multiple accept="image/jpeg,image/png,image/webp" className="wp-file-input" />
                  <small className="wp-hint">Upload extra photos for detail slider</small>
                </div>
              )}
            </div>
          </div>

          {/* Categories & Attributes Box */}
          <div className="wp-sidebar-box">
            <div className="wp-sidebar-header">
              <h3>Categories & Metadata</h3>
            </div>
            <div className="wp-sidebar-body">
              <div className="wp-field-group">
                <label className="wp-label">Tags</label>
                <input
                  name="tags"
                  defaultValue={Array.isArray(item?.tags) ? item.tags.join(', ') : ''}
                  placeholder="corporate, grand opening"
                  className="wp-input"
                />
                <small className="wp-hint">Comma separated</small>
              </div>

              {kind !== 'service' && (
                <div className="wp-field-group">
                  <label className="wp-label">Category</label>
                  <input
                    name="category"
                    defaultValue={String(item?.category ?? '')}
                    placeholder="e.g. Corporate, Grand Opening"
                    className="wp-input"
                  />
                </div>
              )}

              {kind === 'blog' && (
                <div className="wp-field-group">
                  <label className="wp-label">Author Name</label>
                  <input
                    name="author_name"
                    defaultValue={String(item?.author_name ?? '')}
                    placeholder="Author name"
                    className="wp-input"
                  />
                </div>
              )}

              {kind === 'project' && (
                <>
                  <div className="wp-field-group">
                    <label className="wp-label">Client Name</label>
                    <input
                      name="client_name"
                      defaultValue={String(item?.client_name ?? '')}
                      placeholder="Client name"
                      className="wp-input"
                    />
                  </div>
                  <div className="wp-field-group">
                    <label className="wp-label">Location</label>
                    <input
                      name="location"
                      defaultValue={String(item?.location ?? '')}
                      placeholder="Phnom Penh, Cambodia"
                      className="wp-input"
                    />
                  </div>
                  <div className="wp-field-group">
                    <label className="wp-label">Event Date</label>
                    <input
                      type="date"
                      name="event_date"
                      defaultValue={String(item?.event_date ?? '')}
                      className="wp-input"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

      </div>
    </form>
  );
}
