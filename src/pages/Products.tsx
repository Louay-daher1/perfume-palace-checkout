import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { useCategories, useProductsPaginated } from "@/hooks/use-products";
import { PRODUCT_SORT_OPTIONS, parseProductSort, type ProductSort } from "@/lib/product-sort";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

const PER_PAGE = 15;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const pageParam = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const activeSort = parseProductSort(searchParams.get("sort"));
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All");

  const { data: categories } = useCategories();
  const categoryFilter = activeCategory === "All" ? undefined : activeCategory;
  const { data: paginated, isLoading, isError, isFetching } = useProductsPaginated(
    categoryFilter,
    pageParam,
    PER_PAGE,
    activeSort,
  );

  const products = paginated?.data ?? [];
  const meta = paginated?.meta;

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const applySearchParams = (page: number, category: string, sort: ProductSort) => {
    const next = new URLSearchParams();
    next.set("page", String(page));
    next.set("sort", sort);
    if (category !== "All") {
      next.set("category", category);
    }
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updatePage = (page: number) => {
    applySearchParams(page, activeCategory, activeSort);
  };

  const selectCategory = (cat: string) => {
    setActiveCategory(cat);
    applySearchParams(1, cat, activeSort);
  };

  const selectSort = (sort: ProductSort) => {
    applySearchParams(1, activeCategory, sort);
  };

  const categoryNames = ["All", ...(categories?.map((c) => c.name) ?? [])];
  const activeSortLabel =
    PRODUCT_SORT_OPTIONS.find((option) => option.value === activeSort)?.label ?? "New Arrivals";
  const lastPage = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? pageParam;

  const pageNumbers = (() => {
    if (lastPage <= 7) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }
    const pages = new Set<number>([1, lastPage, currentPage, currentPage - 1, currentPage + 1]);
    return [...pages].filter((p) => p >= 1 && p <= lastPage).sort((a, b) => a - b);
  })();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-10">
          <p className="font-sans text-xs tracking-[0.4em] text-primary uppercase mb-2">Browse</p>
          <h1 className="font-display text-2xl sm:text-4xl text-foreground">Our Collection</h1>
        </div>

        <div className="relative mb-6 sm:mb-10">
          <div className="absolute right-0 top-0 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-border bg-background"
                  aria-label={`Sort: ${activeSortLabel}`}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-sans text-xs tracking-wider uppercase text-muted-foreground">
                  Sort by
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={activeSort}
                  onValueChange={(value) => selectSort(value as ProductSort)}
                >
                  {PRODUCT_SORT_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value} className="font-sans text-sm">
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap pr-11">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => selectCategory(cat)}
              className={`font-sans text-[10px] sm:text-xs tracking-wider uppercase px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-colors touch-manipulation [-webkit-tap-highlight-color:transparent] ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
          </div>
        </div>

        {isLoading && (
          <p className="text-center text-muted-foreground font-body animate-pulse py-12">Loading products…</p>
        )}
        {isError && (
          <p className="text-center text-muted-foreground font-body py-12">
            Could not reach the server. Run the backend with{" "}
            <code className="text-primary">php artisan serve --host=0.0.0.0 --port=8000</code>
          </p>
        )}
        {!isLoading && !isError && products.length === 0 && (
          <p className="text-center text-muted-foreground font-body">No products in this category.</p>
        )}
        {!isLoading && !isError && products.length > 0 && (
          <>
            <div
              className={cn(
                "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 xl:gap-6",
                isFetching && "opacity-60 pointer-events-none",
              )}
            >
              {products.map((product, i) => (
                <ProductCard key={product.product_id} product={product} index={i} grid />
              ))}
            </div>

            {meta && meta.total > 0 && (
              <p className="text-center text-muted-foreground font-sans text-xs mt-6">
                Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
              </p>
            )}

            {lastPage > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          updatePage(currentPage - 1);
                        }
                      }}
                      className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  {pageNumbers.map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          updatePage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < lastPage) {
                          updatePage(currentPage + 1);
                        }
                      }}
                      className={cn(currentPage >= lastPage && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;