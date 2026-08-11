'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Json } from '@/lib/types';
import { localized } from '@/lib/i18n';
import { AutoTranslateAllButton } from './translation-button';
import { AdminSubmitButton } from './admin-submit-button';
import { RichTextEditor } from './rich-text-editor';
import { FeaturedImageField } from './featured-image-field';

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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/flags/uk.svg" alt="UK" className="inline-block w-4 h-3 object-cover rounded-xs mr-1.5" /> English
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'km'}
                className={`wp-lang-tab ${activeTab === 'km' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('km')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/flags/cambodia.svg" alt="Khmer" className="inline-block w-4 h-3 object-cover rounded-xs mr-1.5" /> Khmer
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'zh'}
                className={`wp-lang-tab ${activeTab === 'zh' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('zh')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/flags/china.svg" alt="Chinese" className="inline-block w-4 h-3 object-cover rounded-xs mr-1.5" /> Chinese
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'all'}
                className={`wp-lang-tab ${activeTab === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <svg className="w-3.5 h-3.5 text-slate-500 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.6 9h16.8M3.6 15h16.8" />
                </svg> All Languages
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
              <small>Main text, images, and HTML content for this {kind}</small>
            </div>
            <div className="wp-metabox-content">
              {(['en', 'km', 'zh'] as const).map((locale) => (
                <div key={locale} className={`wp-field-locale ${activeTab === 'all' || activeTab === locale ? 'is-visible' : 'is-hidden'}`}>
                  {activeTab === 'all' && <span className="wp-locale-tag">{locale.toUpperCase()}</span>}
                  <RichTextEditor
                    name={`content_${locale}`}
                    defaultValue={value(content, locale)}
                    placeholder={`Write content body in ${locale.toUpperCase()}…`}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* WordPress Yoast-Style SEO Meta Box */}
          <div className="wp-metabox wp-seo-metabox">
            <details className="wp-details">
              <summary className="wp-details-summary flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-600 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search Engine Optimization (SEO) & Accessibility</span>
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
          
          {/* Publish & Status Settings Box */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mb-5">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Publish Status</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                Boolean(item?.is_published) ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${Boolean(item?.is_published) ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {Boolean(item?.is_published) ? 'Published' : 'Draft'}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Public Visibility Toggle Card */}
              <label className="flex items-start gap-3 p-3 bg-slate-50/80 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-100/60 transition-colors">
                <input
                  type="checkbox"
                  name="is_published"
                  defaultChecked={Boolean(item?.is_published)}
                  className="mt-0.5 w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Publish publicly on website</span>
                  <span className="text-slate-500">Make this item live and visible to visitors</span>
                </div>
              </label>

              {/* Homepage Feature Toggle Card */}
              {kind === 'project' && (
                <label className="flex items-start gap-3 p-3 bg-amber-50/60 border border-amber-200/80 rounded-md cursor-pointer hover:bg-amber-50 transition-colors">
                  <input
                    type="checkbox"
                    name="is_featured"
                    defaultChecked={Boolean(item?.is_featured)}
                    className="mt-0.5 w-4 h-4 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-amber-950 block">Feature on Home Page Grid</span>
                    <span className="text-amber-700/80">Highlight on the front page showcase section</span>
                  </div>
                </label>
              )}

              {/* Sorting Priority Order */}
              {kind !== 'blog' && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Display Sorting Position
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    min="0"
                    defaultValue={String(item?.display_order ?? 0)}
                    className="w-full px-3 py-2 text-sm font-semibold border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Position 1 appears first at the top of lists.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3">
              <Link href={returnPath} className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Cancel
              </Link>
              <AdminSubmitButton>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save & Publish</span>
                </span>
              </AdminSubmitButton>
            </div>
          </div>

          {/* Featured Image & Gallery Box */}
          <FeaturedImageField
            initialImage={typeof item?.cover_image === 'string' ? item.cover_image : null}
            kind={kind}
            initialGallery={Array.isArray(item?.gallery) ? (item.gallery as string[]) : null}
          />

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
